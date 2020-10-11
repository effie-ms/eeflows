import datetime

from django.core.files import File
from django.test import TestCase
from django.urls import reverse

import pandas as pd
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import User
from stations.constants import EFlowType, MeasurementType, SensorType
from stations.models import BioPeriod, FET, FishCoefficients, Station
from stations.rest.serializers import StationSerializer
from stations.utils.bioperiods import (
    get_bioperiod_start_dates_within,
    get_fish_coeff_by_bioperiod_and_flow_type,
    get_full_bioperiod_range,
)
from stations.utils.read_data import get_measurement_ts


client = APIClient()


# Execution time test example:
# import time
# start_time = time.time()
# func()
# print("--- %s seconds ---" % (time.time() - start_time))


class StationsTest(TestCase):
    def setUp(self):
        # Create user
        user = User.objects.create(email="test_email123@gmail.com", name="test_name",)
        client.force_authenticate(user)

        # Prepare Excel file
        self.file_path = "static/measurements/10 19 291 Aesoo #.xlsx"
        self.hydrological_data = pd.ExcelFile(self.file_path)
        self.invalid_xl = pd.ExcelFile("static/invalid_xl.xlsx")

        # Create station
        bioperiods_months = BioPeriod.objects.create(name="Test bioperiods")
        base_p_coefficients = FishCoefficients.objects.create(
            name="Test coeff base", winter=1.0, autumn=2.0, summer=3.5, spring=5.4
        )
        critical_p_coefficients = FishCoefficients.objects.create(
            name="Test coeff critical", winter=2.0, autumn=3.0, summer=4.5, spring=6.4
        )
        subsistence_p_coefficients = FishCoefficients.objects.create(
            name="Test coeff subsistence",
            winter=3.0,
            autumn=4.0,
            summer=5.5,
            spring=7.4,
        )
        fet = FET.objects.create(
            fet_name="3",
            bioperiods_months=bioperiods_months,
            base_p_coefficients=base_p_coefficients,
            critical_p_coefficients=critical_p_coefficients,
            subsistence_p_coefficients=subsistence_p_coefficients,
        )
        self.station = Station.objects.create(
            name="Aesoo",
            catchment_area=120.5,
            river_FET=fet,
            river_body="river1",
            longitude=1,
            latitude=1,
        )
        # Attach Excel file
        f = open(self.file_path, "rb")
        bytes = File(f)
        self.station.hydrological_data.save("testExcel.xlsx", bytes)
        f.close()

    def test_get_valid_single_station(self):
        response = client.get(
            reverse("api-stations-detail", kwargs={"pk": self.station.pk})
        )
        station = Station.objects.get(pk=self.station.pk)
        serializer = StationSerializer(station)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_station(self):
        response = client.get(reverse("api-stations-detail", kwargs={"pk": -999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_all_stations(self):
        Station.objects.create(
            name="River2",
            catchment_area=120.5,
            river_FET=self.station.river_FET,
            river_body="river2",
            longitude=2,
            latitude=2,
        )
        Station.objects.create(
            name="River3",
            catchment_area=120.5,
            river_FET=self.station.river_FET,
            river_body="river3",
            longitude=3,
            latitude=3,
        )
        response = client.get(reverse("api-stations-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_eflows(self):
        valid_pk = self.station.pk
        valid_from_time = "2012-01-01"
        valid_to_time = "2012-12-31"
        valid_sec_axis_ts_type1 = "TW"
        valid_sec_axis_ts_type2 = "WL"
        valid_sec_axis_threshold = 0
        valid_fet_id = self.station.river_FET.pk
        valid_area = 100
        valid_area_factor = 1

        data = {
            "fromTime": valid_from_time,
            "toTime": valid_to_time,
            "secondAxisType": valid_sec_axis_ts_type1,
            "secondAxisThreshold": valid_sec_axis_threshold,
            "fetId": valid_fet_id,
            "area": valid_area,
            "areaFactor": valid_area_factor,
            "fillMissingEflows": False,
            "fillMissingSecondAxis": False,
            "forecastMultiStationsEflows": False,
            "forecastMultiStationsSecondAxis": False,
            "forecastEflowsVariable": "Q",
            "forecastSecondAxisVariable": "TW",
            "meanLowFlowMethod": "TNT30",
            "meanLowFlowMethodFrequency": "SEASONAL",
            "multiplyByFishCoefficients": True,
        }

        import time

        start_time = time.time()
        # valid payload
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": valid_pk}), data=data
        )
        print("--- %s seconds ---" % (time.time() - start_time))
        self.assertEqual(response.status_code, 200)  # success

        # not existing station
        invalid_pk = -999
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": invalid_pk}),
            data={
                "fromTime": valid_from_time,
                "toTime": valid_to_time,
                "secondAxisType": valid_sec_axis_ts_type2,
                "secondAxisThreshold": valid_sec_axis_threshold,
                "fetId": valid_fet_id,
                "area": valid_area,
                "areaFactor": valid_area_factor,
                "fillMissingEflows": False,
                "fillMissingSecondAxis": False,
                "forecastMultiStationsEflows": False,
                "forecastMultiStationsSecondAxis": False,
                "forecastEflowsVariable": "Q",
                "forecastSecondAxisVariable": "TW",
                "meanLowFlowMethod": "TNT30",
                "meanLowFlowMethodFrequency": "LONG-TERM",
                "multiplyByFishCoefficients": True,
            },
        )
        self.assertEqual(response.status_code, 404)  # not found

        # missing data in query
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": valid_pk}),
            data={
                "fromTime": valid_from_time,
                "secondAxisThreshold": valid_sec_axis_threshold,
            },
        )
        self.assertEqual(response.status_code, 400)  # bad request

        # invalid dates - type
        invalid_from_time = "12/12/12"
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": valid_pk}),
            data={
                "fromTime": invalid_from_time,
                "toTime": valid_to_time,
                "secondAxisType": valid_sec_axis_ts_type2,
                "secondAxisThreshold": valid_sec_axis_threshold,
                "fetId": valid_fet_id,
                "area": valid_area,
                "areaFactor": valid_area_factor,
                "fillMissingEflows": False,
                "fillMissingSecondAxis": False,
                "forecastMultiStationsEflows": False,
                "forecastMultiStationsSecondAxis": False,
                "forecastEflowsVariable": "Q",
                "forecastSecondAxisVariable": "TW",
                "meanLowFlowMethod": "TNT30",
                "meanLowFlowMethodFrequency": "SEASONAL",
                "multiplyByFishCoefficients": True,
            },
        )
        self.assertEqual(response.status_code, 400)  # bad request

        # toTime before fromTime
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": valid_pk}),
            data={
                "fromTime": valid_to_time,
                "toTime": valid_from_time,
                "secondAxisType": valid_sec_axis_ts_type2,
                "secondAxisThreshold": valid_sec_axis_threshold,
                "fetId": valid_fet_id,
                "area": valid_area,
                "areaFactor": valid_area_factor,
                "fillMissingEflows": False,
                "fillMissingSecondAxis": False,
                "forecastMultiStationsEflows": False,
                "forecastMultiStationsSecondAxis": False,
                "forecastEflowsVariable": "Q",
                "forecastSecondAxisVariable": "TW",
                "meanLowFlowMethod": "TNT30",
                "meanLowFlowMethodFrequency": "SEASONAL",
                "multiplyByFishCoefficients": True,
            },
        )
        self.assertEqual(response.status_code, 400)  # bad request

        # invalid secondary axis time series type
        invalid_ts_type = "invalid"
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": valid_pk}),
            data={
                "fromTime": valid_from_time,
                "toTime": valid_to_time,
                "secondAxisType": invalid_ts_type,
                "secondAxisThreshold": valid_sec_axis_threshold,
                "fetId": valid_fet_id,
                "area": valid_area,
                "areaFactor": valid_area_factor,
                "fillMissingEflows": False,
                "fillMissingSecondAxis": False,
                "forecastMultiStationsEflows": False,
                "forecastMultiStationsSecondAxis": False,
                "forecastEflowsVariable": "Q",
                "forecastSecondAxisVariable": "TW",
                "meanLowFlowMethod": "TNT30",
                "meanLowFlowMethodFrequency": "SEASONAL",
                "multiplyByFishCoefficients": True,
            },
        )
        self.assertEqual(response.status_code, 400)  # bad request

        # invalid secondary axis threshold value
        invalid_threshold = "AAA"
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": valid_pk}),
            data={
                "fromTime": valid_from_time,
                "toTime": valid_to_time,
                "secondAxisType": valid_sec_axis_ts_type2,
                "secondAxisThreshold": invalid_threshold,
                "fetId": valid_fet_id,
                "area": valid_area,
                "areaFactor": valid_area_factor,
                "fillMissingEflows": False,
                "fillMissingSecondAxis": False,
                "forecastMultiStationsEflows": False,
                "forecastMultiStationsSecondAxis": False,
                "forecastEflowsVariable": "Q",
                "forecastSecondAxisVariable": "TW",
                "meanLowFlowMethod": "TNT30",
                "meanLowFlowMethodFrequency": "SEASONAL",
                "multiplyByFishCoefficients": True,
            },
        )
        self.assertEqual(response.status_code, 400)  # bad request

        # not existing fet
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": valid_pk}),
            data={
                "fromTime": valid_from_time,
                "toTime": valid_to_time,
                "secondAxisType": valid_sec_axis_ts_type2,
                "secondAxisThreshold": valid_sec_axis_threshold,
                "fetId": 100500,
                "area": valid_area,
                "areaFactor": valid_area_factor,
                "fillMissingEflows": False,
                "fillMissingSecondAxis": False,
                "forecastMultiStationsEflows": False,
                "forecastMultiStationsSecondAxis": False,
                "forecastEflowsVariable": "Q",
                "forecastSecondAxisVariable": "TW",
                "meanLowFlowMethod": "TNT30",
                "meanLowFlowMethodFrequency": "SEASONAL",
                "multiplyByFishCoefficients": True,
            },
        )
        self.assertEqual(response.status_code, 400)  # bad request

        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": valid_pk}),
            data={
                "fromTime": valid_from_time,
                "toTime": valid_to_time,
                "secondAxisType": valid_sec_axis_ts_type2,
                "secondAxisThreshold": valid_sec_axis_threshold,
                "fetId": valid_fet_id,
                "area": 0,
                "areaFactor": 0,
                "fillMissingEflows": False,
                "fillMissingSecondAxis": False,
                "forecastMultiStationsEflows": False,
                "forecastMultiStationsSecondAxis": False,
                "forecastEflowsVariable": "Q",
                "forecastSecondAxisVariable": "TW",
                "meanLowFlowMethod": "TNT30",
                "meanLowFlowMethodFrequency": "SEASONAL",
                "multiplyByFishCoefficients": True,
            },
        )
        self.assertEqual(response.status_code, 200)

    def test_read_measurements(self):
        from_time = datetime.date(2012, 1, 1)
        to_time = datetime.date(2012, 12, 31)
        pd_excel_file = pd.ExcelFile(self.station.hydrological_data.path)
        fill_missing_values = False
        avg_forecast_df_with_compatibility = None

        temperature_min_ts, _ = get_measurement_ts(
            pd_excel_file,
            SensorType.WaterTemperature,
            MeasurementType.MIN,
            from_time,
            to_time,
            fill_missing_values,
            avg_forecast_df_with_compatibility,
        )
        self.assertEqual(len(temperature_min_ts), 366)

        discharge_avg_ts, _ = get_measurement_ts(
            pd_excel_file,
            SensorType.Discharge,
            MeasurementType.AVG,
            from_time,
            to_time,
            fill_missing_values,
            avg_forecast_df_with_compatibility,
        )
        self.assertEqual(len(discharge_avg_ts), 366)

        wlevel_max_df, _ = get_measurement_ts(
            pd_excel_file,
            SensorType.WaterLevel,
            MeasurementType.MAX,
            from_time,
            to_time,
            fill_missing_values,
            avg_forecast_df_with_compatibility,
        )
        self.assertEqual(len(wlevel_max_df), 366)

        # invalid excel
        pd_invalid_xl = pd.ExcelFile(self.invalid_xl)
        ts, _ = get_measurement_ts(
            pd_invalid_xl,
            SensorType.WaterTemperature,
            MeasurementType.MIN,
            from_time,
            to_time,
            fill_missing_values,
            avg_forecast_df_with_compatibility,
        )
        self.assertEqual(ts, None)

        # dates out of range
        out_from = datetime.date(2008, 1, 1)
        out_to = datetime.date(2020, 12, 31)

        discharge_avg_ts, _ = get_measurement_ts(
            pd_excel_file,
            SensorType.Discharge,
            MeasurementType.AVG,
            out_from,
            to_time,
            fill_missing_values,
            avg_forecast_df_with_compatibility,
        )
        self.assertEqual(len(discharge_avg_ts), 365 * 3 + 366 * 2)

        discharge_avg_ts, _ = get_measurement_ts(
            pd_excel_file,
            SensorType.Discharge,
            MeasurementType.AVG,
            from_time,
            out_to,
            fill_missing_values,
            avg_forecast_df_with_compatibility,
        )
        self.assertEqual(len(discharge_avg_ts), 365 * 6 + 366 * 3)

        # from_time is after to_time
        discharge_avg_ts, _ = get_measurement_ts(
            pd_excel_file,
            SensorType.Discharge,
            MeasurementType.AVG,
            to_time,
            from_time,
            fill_missing_values,
            avg_forecast_df_with_compatibility,
        )
        self.assertEqual(len(discharge_avg_ts), 0)

        # from_time is same as to_time
        discharge_avg_df, _ = get_measurement_ts(
            pd_excel_file,
            SensorType.Discharge,
            MeasurementType.AVG,
            from_time,
            from_time,
            fill_missing_values,
            avg_forecast_df_with_compatibility,
        )
        self.assertEqual(len(discharge_avg_ts), 1)

    def test_get_bioperiod_start_dates_within(self):
        from_time = datetime.date(2012, 1, 1)
        to_time = datetime.date(2013, 12, 31)
        dates_and_labels = get_bioperiod_start_dates_within(
            self.station.river_FET.bioperiods_months, from_time, to_time
        )
        self.assertEqual(len(dates_and_labels), 8)
        actual_dates = [
            {"date": "2012-01-01", "label": "Fall Spawning/Overwintering"},
            {"date": "2012-03-01", "label": "Overwintering/Spring Spawning"},
            {"date": "2012-07-01", "label": "Spring Spawning/Rearing and Growth"},
            {"date": "2012-10-01", "label": "Rearing and Growth/Fall Spawning"},
            {"date": "2013-01-01", "label": "Fall Spawning/Overwintering"},
            {"date": "2013-03-01", "label": "Overwintering/Spring Spawning"},
            {"date": "2013-07-01", "label": "Spring Spawning/Rearing and Growth"},
            {"date": "2013-10-01", "label": "Rearing and Growth/Fall Spawning"},
        ]
        self.assertEqual(dates_and_labels, actual_dates)

    def test_get_full_bioperiod_range(self):
        from_time = datetime.date(2012, 2, 10)
        to_time = datetime.date(2012, 11, 30)
        actual_from_time_bioperiod = datetime.date(2012, 1, 1)
        actual_to_time_bioperiod = datetime.date(2012, 12, 31)
        from_time_bioperiod, to_time_bioperiod = get_full_bioperiod_range(
            self.station.river_FET.bioperiods_months, from_time, to_time
        )
        self.assertEqual(actual_from_time_bioperiod, from_time_bioperiod)
        self.assertEqual(actual_to_time_bioperiod, to_time_bioperiod)

    def test_calculate_eflow(self):
        fet = self.station.river_FET
        catchment_area = self.station.catchment_area
        p_type = EFlowType.Base
        idx = datetime.datetime(2012, 1, 1)
        q = 10

        expected_value = (
            self.station.catchment_area
            * q
            * self.station.river_FET.base_p_coefficients.winter
        )

        calculated_value = (
            get_fish_coeff_by_bioperiod_and_flow_type(
                fet, fet.bioperiods_months.get_bioperiod_by_month(idx.month), p_type
            )
            * q
            * catchment_area
        )
        self.assertEqual(expected_value, calculated_value)

    def test_forecasting(self):
        pk = self.station.pk
        valid_from_time = "2013-01-01"
        valid_to_time = "2013-04-01"
        valid_temperature_threshold = 0

        # valid payload
        response = client.get(
            reverse("api-stations-eflows", kwargs={"pk": pk}),
            data={
                "fromTime": valid_from_time,
                "toTime": valid_to_time,
                "secondAxisType": "TW",
                "secondAxisThreshold": valid_temperature_threshold,
                "fetId": self.station.river_FET.id,
                "area": 100,
                "areaFactor": 2,
                "fillMissingEflows": True,
                "fillMissingSecondAxis": True,
                "forecastMultiStationsEflows": True,
                "forecastMultiStationsSecondAxis": False,
                "forecastEflowsVariable": "Q",
                "forecastSecondAxisVariable": "WL",
                "meanLowFlowMethod": "TNT30",
                "meanLowFlowMethodFrequency": "SEASONAL",
                "multiplyByFishCoefficients": True,
            },
        )
        self.assertEqual(response.status_code, 200)  # success
