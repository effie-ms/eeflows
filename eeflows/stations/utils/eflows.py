import datetime
import json

import numpy as np
import pandas as pd

from stations.constants import (
    EFlowType,
    MeanLowFlowMethod,
    MeasurementType,
    SensorType,
    MeanLowFlowMethodFrequency,
)
from stations.utils.bioperiods import (
    get_fish_coeff_by_bioperiod_and_flow_type,
    get_low_flow_series,
)
from stations.utils.read_data import (
    get_measurement_ts,
    get_measurement_ts_without_filtering,
)


def calculate_eflow_threshold(
    all_discharge_to_time_df,
    time_axis,
    from_time,
    to_time,
    low_flow_method,
    low_flow_method_freq,
    station,
    measurement_type_prefix,
):
    low_flow_ts = get_low_flow_series(
        all_discharge_to_time_df,
        time_axis,
        station,
        low_flow_method,
        low_flow_method_freq,
    )

    eflow_level_ts = pd.Series(
        data=[q if q else np.NaN for idx, q in low_flow_ts.iteritems()],
        index=low_flow_ts.index,
    )
    filtered_dates = [dt for dt in eflow_level_ts.index.tolist() if from_time <= dt <= to_time]

    low_eflow_level_ts = eflow_level_ts.loc[filtered_dates]

    col_name = f"{measurement_type_prefix}_low_eflow_level"
    thresholds_df = pd.DataFrame(columns=[col_name], index=low_eflow_level_ts.index)
    thresholds_df[col_name] = low_eflow_level_ts.values

    return thresholds_df


def get_eflows_df(
    pd_excel_file,
    from_time,
    to_time,
    measurement_type,
    low_flow_method,
    low_flow_method_freq,
    station,
):
    discharge_ts = get_measurement_ts(
        pd_excel_file,
        SensorType.Discharge,
        measurement_type,
        from_time,
        to_time,
    )

    whole_ts = get_measurement_ts_without_filtering(
        pd_excel_file, SensorType.Discharge, measurement_type
    )
    filtered_dates = [dt for dt in whole_ts.index.tolist() if dt <= pd.Timestamp(to_time)]
    all_discharge_to_time_ts = whole_ts.loc[filtered_dates]

    measurement_type_prefix = ""
    if measurement_type == MeasurementType.MIN:
        measurement_type_prefix = "min"
    if measurement_type == MeasurementType.AVG:
        measurement_type_prefix = "avg"
    if measurement_type == MeasurementType.MAX:
        measurement_type_prefix = "max"

    thresholds_df = calculate_eflow_threshold(
        all_discharge_to_time_ts,
        discharge_ts.index.sort_values(),
        from_time,
        to_time,
        low_flow_method,
        low_flow_method_freq,
        station,
        measurement_type_prefix,
    )

    discharge_ts.name = f"{measurement_type_prefix}_discharge"

    eflow_df = pd.concat(
        [
            discharge_ts,
            thresholds_df,
        ],
        axis=1,
        sort=False,
    )

    return eflow_df


def get_eflow_all_types_df(
    station,
    pd_excel_file,
    from_time,
    to_time,
    low_flow_method,
    low_flow_method_freq,
):
    min_eflow_df = get_eflows_df(
        pd_excel_file,
        from_time,
        to_time,
        MeasurementType.MIN,
        low_flow_method,
        low_flow_method_freq,
        station,
    )

    avg_eflow_df = get_eflows_df(
        pd_excel_file,
        from_time,
        to_time,
        MeasurementType.AVG,
        low_flow_method,
        low_flow_method_freq,
        station,
    )

    max_eflow_df = get_eflows_df(
        pd_excel_file,
        from_time,
        to_time,
        MeasurementType.MAX,
        low_flow_method,
        low_flow_method_freq,
        station,
    )

    eflow_df = pd.concat(
        objs=[min_eflow_df, avg_eflow_df, max_eflow_df],
        sort=False,
        axis=1,
    )

    return eflow_df


def get_second_axis_all_types_df(
    pd_excel_file,
    from_time,
    to_time,
    sec_axis_ts_type,
):
    min_sec_axis_ts = get_measurement_ts(
        pd_excel_file,
        sec_axis_ts_type,
        MeasurementType.MIN,
        from_time,
        to_time,
    )

    avg_sec_axis_ts = get_measurement_ts(
        pd_excel_file,
        sec_axis_ts_type,
        MeasurementType.AVG,
        from_time,
        to_time,
    )

    max_sec_axis_ts = get_measurement_ts(
        pd_excel_file,
        sec_axis_ts_type,
        MeasurementType.MAX,
        from_time,
        to_time,
    )

    min_sec_axis_ts.name = "min_second_axis_ts"
    avg_sec_axis_ts.name = "avg_second_axis_ts"
    max_sec_axis_ts.name = "max_second_axis_ts"

    sec_axis_all_types_df = pd.concat(
        objs=[
            min_sec_axis_ts,
            avg_sec_axis_ts,
            max_sec_axis_ts,
        ],
        axis=1,
        sort=False,
    )

    return sec_axis_all_types_df


def get_eflows_compliance(
    station,
    pd_excel_file,
    from_time,
    to_time,
    sec_axis_ts_type,
    low_flow_method,
    low_flow_method_freq,
):
    eflow_all_types_df = get_eflow_all_types_df(
        station,
        pd_excel_file,
        from_time,
        to_time,
        low_flow_method,
        low_flow_method_freq,
    )

    sec_axis_all_types_df = get_second_axis_all_types_df(
        pd_excel_file,
        from_time,
        to_time,
        sec_axis_ts_type,
    )

    eflow_and_sec_axis_df = pd.concat(
        objs=[eflow_all_types_df, sec_axis_all_types_df], axis=1, sort=False
    )

    eflow_and_sec_axis_df["date"] = eflow_and_sec_axis_df.index

    if station.bioperiods_months:
        eflow_and_sec_axis_df["bioperiod"] = [
            station.bioperiods_months.get_short_bioperiod_name_by_month(date.month)
            for date in eflow_and_sec_axis_df.index
        ]
    else:
        eflow_and_sec_axis_df["bioperiod"] = []

    # dataframe to json
    def convert_timestamp(item_date_object):
        if isinstance(item_date_object, (datetime.date, datetime.datetime)):
            return item_date_object.strftime("%Y-%m-%d")

    dict_ = eflow_and_sec_axis_df.to_dict(orient="records")
    data_json = json.dumps(dict_, default=convert_timestamp)
    eflow_and_sec_axis_df_json = json.loads(data_json)

    return eflow_and_sec_axis_df_json

