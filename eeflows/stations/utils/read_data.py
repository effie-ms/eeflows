import datetime
import json

import pandas as pd

from stations.constants import (
    MeanLowFlowMethod,
    MeanLowFlowMethodFrequency,
    MeasurementType,
    SensorType,
)
from stations.utils.forecast import forecast_for_missing_values


def get_sheet_substring_measurement_type(measurement_type):
    if measurement_type == MeasurementType.AVG:
        return "mean"
    if measurement_type == MeasurementType.MIN:
        return "min"
    if measurement_type == MeasurementType.MAX:
        return "max"
    if measurement_type == MeasurementType.ALL:
        return "all"
    return None


def get_measurement_type_by_abbreviation(measurement_type_abbr):
    if measurement_type_abbr == "avg":
        return MeasurementType.AVG
    if measurement_type_abbr == "min":
        return MeasurementType.MIN
    if measurement_type_abbr == "max":
        return MeasurementType.MAX
    if measurement_type_abbr == "all":
        return MeasurementType.ALL
    return None


def get_sheet_substring_sensor_type(sensor_type):
    if sensor_type == SensorType.WaterLevel:
        return "WL"
    if sensor_type == SensorType.Discharge:
        return "Q"
    if sensor_type == SensorType.WaterTemperature:
        return "TW"
    return None


def get_sensor_type_by_abbreviation(sensor_type_abbr):
    if sensor_type_abbr == "WL":
        return SensorType.WaterLevel
    if sensor_type_abbr == "Q":
        return SensorType.Discharge
    if sensor_type_abbr == "TW":
        return SensorType.WaterTemperature
    return None


def get_low_flow_method_by_abbr(method_abbr):
    if method_abbr == "TNT30":
        return MeanLowFlowMethod.Tennant30
    if method_abbr == "TNT20":
        return MeanLowFlowMethod.Tennant20
    if method_abbr == "EXCEED95":
        return MeanLowFlowMethod.ExceedanceProbability95
    if method_abbr == "EXCEED75":
        return MeanLowFlowMethod.ExceedanceProbability75
    return None


def get_low_flow_method_freq_by_abbr(freq_abbr):
    if freq_abbr == "LONG-TERM":
        return MeanLowFlowMethodFrequency.LongTerm
    if freq_abbr == "SEASONAL":
        return MeanLowFlowMethodFrequency.Seasonal
    if freq_abbr == "BIOPERIOD":
        return MeanLowFlowMethodFrequency.Bioperiodical
    if freq_abbr == "MONTHLY":
        return MeanLowFlowMethodFrequency.Monthly
    return None


def get_sheet_substring(sensor_type, measurement_type):
    measurement_substring = get_sheet_substring_measurement_type(measurement_type)
    sensor_substring = get_sheet_substring_sensor_type(sensor_type)
    if measurement_substring and sensor_substring:
        return f"{sensor_substring} {measurement_substring}"
    return None


def get_measurement_df_without_filtering(pd_excel_file, sensor_type, measurement_type):
    sheets = pd_excel_file.sheet_names
    sheet_substring = get_sheet_substring(sensor_type, measurement_type)
    sheet_name = [name for name in sheets if sheet_substring in name]
    if sheet_name:
        sheet_name = sheet_name[0]
        # read file skipping 2 first rows (file format)
        df = pd_excel_file.parse(
            sheet_name, parse_dates=True, skiprows=[0, 1], index_col=0
        )
        if len(df.columns) > 0:
            # take the first column
            if df.ndim > 1:
                df = df.iloc[:, 0]

            # drop missing values
            df = pd.to_numeric(df, errors="coerce").dropna()
            return df
    return None


def get_measurement_df(
    pd_excel_file,
    sensor_type,
    measurement_type,
    from_time,
    to_time,
    fill_missing_values,
    avg_forecast_df_with_compatibility,
):
    df = get_measurement_df_without_filtering(
        pd_excel_file, sensor_type, measurement_type
    )
    if df is not None:
        # take dates within [from_time..to_time]
        filtered_dates = [dt for dt in df.index.tolist() if from_time <= dt <= to_time]
        # take values by selected dates
        filtered_df = df.loc[filtered_dates]
        delta = to_time - from_time  # as timedelta
        all_dates_within = [
            from_time + datetime.timedelta(days=i) for i in range(delta.days + 1)
        ]
        # True if value was forecast, otherwise False
        forecast_flags_df = pd.DataFrame(all_dates_within, columns=["date"])
        forecast_flags_df[
            f"{get_sheet_substring_measurement_type(measurement_type)}_predicted"
        ] = [(dt not in filtered_dates) for dt in all_dates_within]
        forecast_flags_df = forecast_flags_df.set_index("date")
        # return time series with all the dates in the range and with values that can be calculated
        # (can be not all the values)
        if len(filtered_dates) != delta.days:
            filtered_df = filtered_df.reindex(all_dates_within)
            if fill_missing_values and measurement_type == MeasurementType.AVG:
                # forecast null values
                filtered_df_with_forecast = forecast_for_missing_values(
                    filtered_df, avg_forecast_df_with_compatibility
                )
                return filtered_df_with_forecast, forecast_flags_df
        return filtered_df, forecast_flags_df
    return None, None


def get_json_with_converted_timestamp(df):
    """ Serialise DataFrame dates as 'YYYY-MM-DD' in JSON """

    def convert_timestamp(item_date_object):
        if isinstance(item_date_object, (datetime.date, datetime.datetime)):
            return item_date_object.strftime("%Y-%m-%d")

    dict_ = df.to_dict(orient="records")
    data_json = json.dumps(dict_, default=convert_timestamp)
    data = json.loads(data_json)
    return data
