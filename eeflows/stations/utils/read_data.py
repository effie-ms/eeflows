import datetime

import pandas as pd

from stations.constants import (
    MeanLowFlowMethod,
    MeanLowFlowMethodFrequency,
    MeasurementType,
    SensorType,
)


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


def get_measurement_ts_without_filtering(pd_excel_file, sensor_type, measurement_type):
    sheets = pd_excel_file.sheet_names
    sheet_substring = get_sheet_substring(sensor_type, measurement_type)
    sheet_name = [name for name in sheets if sheet_substring in name]
    if sheet_name:
        sheet_name = sheet_name[0]
        # read file skipping 2 first rows (file format)
        df = pd_excel_file.parse(
            sheet_name, parse_dates=True, skiprows=[0, 1], index_col=0
        )
        # take the first column
        if len(df.columns) > 0:
            if df.ndim > 1:
                ts = df.iloc[:, 0]
            else:
                ts = df

            # drop missing values
            ts = pd.to_numeric(ts, errors="coerce").dropna()
            return ts

    return None


def get_measurement_ts(
    pd_excel_file,
    sensor_type,
    measurement_type,
    from_time,
    to_time,
    fill_missing_values,
    avg_forecast_ts,
):
    ts = get_measurement_ts_without_filtering(
        pd_excel_file, sensor_type, measurement_type
    )
    if ts is not None:
        # take dates within [from_time..to_time]
        filtered_dates = [dt for dt in ts.index.tolist() if from_time <= dt <= to_time]
        # take values by selected dates
        filtered_ts = ts.loc[filtered_dates]
        delta = to_time - from_time  # as timedelta
        all_dates_within = [
            from_time + datetime.timedelta(days=i) for i in range(delta.days + 1)
        ]
        # True if value was forecast, otherwise False
        forecast_flags_ts = pd.Series(
            data=[(dt not in filtered_dates) for dt in all_dates_within],
            index=all_dates_within,
        )

        # return time series with all the dates in the range and with values that can be calculated
        # (can be not all the values)
        if len(filtered_dates) != delta.days:
            filtered_ts = filtered_ts.reindex(all_dates_within)
            if fill_missing_values and measurement_type == MeasurementType.AVG:
                # forecast null values
                bool_series = pd.isnull(filtered_ts)
                missing_eflows = filtered_ts[bool_series].copy()
                for dt, missing_value in missing_eflows.items():
                    filtered_ts[dt] = avg_forecast_ts[dt]

        return filtered_ts, forecast_flags_ts
    return None, None
