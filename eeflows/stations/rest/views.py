import json

from django.core.files.storage import default_storage as storage
from django.http import JsonResponse

import pandas as pd
from rest_framework import viewsets
from rest_framework.decorators import action

from stations.models import Station
from stations.rest.serializers import (
    EflowsInputSerializer,
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

    @action(detail=True)
    def eflows(self, request, **kwargs):  # pk is passes as kwargs (default behaviour)
        station = self.get_object()

        input_serializer = EflowsInputSerializer(data=request.query_params.dict())
        input_serializer.is_valid(raise_exception=True)

        sec_axis_ts_type_abbr = input_serializer.validated_data["secondAxisType"]
        sec_axis_ts_type = get_sensor_type_by_abbreviation(sec_axis_ts_type_abbr)

        from_time = input_serializer.validated_data["fromTime"]
        to_time = input_serializer.validated_data["toTime"]

        low_flow_method_abbr = input_serializer.validated_data["meanLowFlowMethod"]
        low_flow_method = get_low_flow_method_by_abbr(low_flow_method_abbr)
        low_flow_method_freq_abbr = input_serializer.validated_data[
            "meanLowFlowMethodFrequency"
        ]
        low_flow_method_freq = get_low_flow_method_freq_by_abbr(
            low_flow_method_freq_abbr
        )

        bioperiods_boundaries = get_bioperiod_start_dates_within(
            station.bioperiods_months, from_time, to_time
        )

        pd_excel_file = pd.ExcelFile(storage.open(station.hydrological_data.name))

        eflows = get_eflows_compliance(
            station,
            pd_excel_file,
            from_time,
            to_time,
            sec_axis_ts_type,
            low_flow_method,
            low_flow_method_freq,
        )

        payload = {
            "eflows_ts": eflows,
            "bioperiods_boundaries": bioperiods_boundaries,
        }

        json_payload = json.dumps(payload)

        return JsonResponse(json_payload, safe=False)
