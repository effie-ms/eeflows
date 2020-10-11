import json

from django.core.files.storage import default_storage as storage
from django.http import JsonResponse

import pandas as pd
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from stations.models import FET, Station
from stations.rest.serializers import (
    EflowsInputSerializer,
    FETInfoSerializer,
    StationSerializer,
)
from stations.utils.bioperiods import get_bioperiod_start_dates_within
from stations.utils.eflows import get_eflows_compliance
from stations.utils.read_data import (
    get_low_flow_method_by_abbr,
    get_low_flow_method_freq_by_abbr,
    get_sensor_type_by_abbreviation,
)


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

    def list(self, request):
        queryset = Station.objects.all().order_by("name")
        serializer = StationSerializer(queryset, many=True)
        fet_queryset = FET.objects.all().order_by("fet_short_label")
        fet_serializer = FETInfoSerializer(fet_queryset, many=True)
        response_dict = {"stations_list": serializer.data, "fets": fet_serializer.data}
        return Response(response_dict)

    @action(detail=True)
    def eflows(self, request, **kwargs):  # pk is passes as kwargs (default behaviour)
        station = self.get_object()

        input_serializer = EflowsInputSerializer(data=request.query_params.dict())
        input_serializer.is_valid(raise_exception=True)

        sec_axis_ts_type_abbr = input_serializer.validated_data["secondAxisType"]
        sec_axis_ts_type = get_sensor_type_by_abbreviation(sec_axis_ts_type_abbr)

        fet_id = input_serializer.validated_data["fetId"]
        area = input_serializer.validated_data["area"]
        area_factor = input_serializer.validated_data["areaFactor"]

        from_time = input_serializer.validated_data["fromTime"]
        to_time = input_serializer.validated_data["toTime"]

        fill_missing_eflows = input_serializer.validated_data["fillMissingEflows"]
        fill_missing_sec_axis = input_serializer.validated_data["fillMissingSecondAxis"]

        multi_stations_eflows = input_serializer.validated_data[
            "forecastMultiStationsEflows"
        ]
        multi_stations_sec_axis = input_serializer.validated_data[
            "forecastMultiStationsSecondAxis"
        ]

        forecast_eflows_var_abbr = input_serializer.validated_data[
            "forecastEflowsVariable"
        ]
        forecast_eflows_var = get_sensor_type_by_abbreviation(forecast_eflows_var_abbr)
        forecast_sec_axis_var_abbr = input_serializer.validated_data[
            "forecastSecondAxisVariable"
        ]
        forecast_sec_axis_var = get_sensor_type_by_abbreviation(
            forecast_sec_axis_var_abbr
        )

        low_flow_method_abbr = input_serializer.validated_data["meanLowFlowMethod"]
        low_flow_method = get_low_flow_method_by_abbr(low_flow_method_abbr)
        low_flow_method_freq_abbr = input_serializer.validated_data[
            "meanLowFlowMethodFrequency"
        ]
        low_flow_method_freq = get_low_flow_method_freq_by_abbr(
            low_flow_method_freq_abbr
        )
        use_fish_coeff = input_serializer.validated_data["multiplyByFishCoefficients"]

        enable_forecasting = input_serializer.validated_data["enableForecasting"]

        fet = FET.objects.filter(pk=fet_id).first()

        bioperiods_boundaries = get_bioperiod_start_dates_within(
            fet.bioperiods_months, from_time, to_time
        )

        # Time-consuming operation (~2 sec), establishing connection to the file once for all data frames
        pd_excel_file = pd.ExcelFile(storage.open(station.hydrological_data.name))

        (eflows, forecasting_summary,) = get_eflows_compliance(
            station,
            pd_excel_file,
            from_time,
            to_time,
            sec_axis_ts_type,
            area,
            area_factor,
            fet_id,
            fill_missing_eflows,
            fill_missing_sec_axis,
            multi_stations_eflows,
            multi_stations_sec_axis,
            forecast_eflows_var,
            forecast_sec_axis_var,
            low_flow_method,
            low_flow_method_freq,
            use_fish_coeff,
            enable_forecasting,
        )

        payload = {
            "from_time": str(from_time),
            "to_time": str(to_time),
            "second_axis_time_series_type": sec_axis_ts_type_abbr,
            "fill_missing_eflows": fill_missing_eflows,
            "fill_missing_sec_axis": fill_missing_sec_axis,
            "multi_stations_eflows": multi_stations_eflows,
            "multi_stations_sec_axis": multi_stations_sec_axis,
            "forecast_eflows_var": forecast_eflows_var_abbr,
            "forecast_sec_axis_var": forecast_sec_axis_var_abbr,
            "area": area,
            "area_factor": area_factor,
            "low_flow_method": low_flow_method_abbr,
            "low_flow_method_freq": low_flow_method_freq_abbr,
            "use_fish_coeff": use_fish_coeff,
            "selected_fet_id": fet_id,
            "eflows_ts": eflows,
            "bioperiods_boundaries": bioperiods_boundaries,
            "forecasting_summary": forecasting_summary,
        }

        json_payload = json.dumps(payload)

        return JsonResponse(json_payload, safe=False)
