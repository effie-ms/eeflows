import datetime
import json

import numpy as np
import pandas as pd

from stations.constants import EFlowType, MeasurementType, SensorType
from stations.models import FET
from stations.utils.bioperiods import (
    get_eflows_all_types,
    get_fish_coeff_by_bioperiod_and_flow_type,
    get_low_flow_series,
)
from stations.utils.forecast import get_predicted_measurement_df
from stations.utils.read_data import (
    get_measurement_ts,
    get_measurement_ts_without_filtering,
)


def get_eflow_value(
    idx,
    q,
    fet,
    p_type,
    catchment_area,
    catchment_area_factor,
    use_fish_coeff,
    watershed,
):
    if q:
        if use_fish_coeff and p_type != EFlowType.Low:
            eflow_value = (
                get_fish_coeff_by_bioperiod_and_flow_type(
                    fet, fet.bioperiods_months.get_bioperiod_by_month(idx.month), p_type
                )
                * q
                * catchment_area
            )
        else:
            eflow_value = q * catchment_area
        if catchment_area_factor == 0:
            return eflow_value
        if watershed != 0:
            factored_eflow_value = eflow_value / (catchment_area_factor * watershed)
            return factored_eflow_value

    return np.NaN


def calculate_eflow(
    fet,
    discharge_df,
    p_type,
    catchment_area,
    catchment_area_factor,
    use_fish_coeff,
    station,
):
    eflow_arr = [
        get_eflow_value(
            idx,
            q,
            fet,
            p_type,
            catchment_area,
            catchment_area_factor,
            use_fish_coeff,
            station.catchment_area,
        )
        for idx, q in discharge_df.iteritems()
    ]

    eflow_ts = pd.Series(data=eflow_arr, index=discharge_df.index)
    return eflow_ts


def calculate_eflow_threshold_by_type(
    fet,
    discharge_ts,
    p_type,
    catchment_area,
    from_time,
    to_time,
    catchment_area_factor,
    use_fish_coeff,
    station,
):
    eflow_level_ts = calculate_eflow(
        fet,
        discharge_ts,
        p_type,
        catchment_area,
        catchment_area_factor,
        use_fish_coeff,
        station,
    )
    filtered_dates = [
        dt for dt in eflow_level_ts.index.tolist() if from_time <= dt <= to_time
    ]
    filtered_eflow_level_ts = eflow_level_ts.loc[filtered_dates]
    return filtered_eflow_level_ts


def calculate_eflow_threshold(
    fet,
    all_discharge_to_time_df,
    time_axis,
    catchment_area,
    from_time,
    to_time,
    catchment_area_factor,
    use_fish_coeff,
    low_flow_method,
    low_flow_method_freq,
    station,
):
    low_flow_ts = get_low_flow_series(
        all_discharge_to_time_df, time_axis, fet, low_flow_method, low_flow_method_freq
    )

    base_flow_ts, subsistence_flow_ts, critical_flow_ts = get_eflows_all_types(
        all_discharge_to_time_df
    )

    low_eflow_level_ts = calculate_eflow_threshold_by_type(
        fet,
        low_flow_ts,
        EFlowType.Low,
        catchment_area,
        from_time,
        to_time,
        catchment_area_factor,
        False,
        station,
    )

    base_eflow_level_ts = calculate_eflow_threshold_by_type(
        fet,
        base_flow_ts,
        EFlowType.Base,
        catchment_area,
        from_time,
        to_time,
        catchment_area_factor,
        use_fish_coeff,
        station,
    )

    subsistence_eflow_level_ts = calculate_eflow_threshold_by_type(
        fet,
        subsistence_flow_ts,
        EFlowType.Subsistence,
        catchment_area,
        from_time,
        to_time,
        catchment_area_factor,
        use_fish_coeff,
        station,
    )

    critical_eflow_level_ts = calculate_eflow_threshold_by_type(
        fet,
        critical_flow_ts,
        EFlowType.Critical,
        catchment_area,
        from_time,
        to_time,
        catchment_area_factor,
        use_fish_coeff,
        station,
    )

    return (
        low_eflow_level_ts,
        base_eflow_level_ts,
        subsistence_eflow_level_ts,
        critical_eflow_level_ts,
    )


def get_eflows_df(
    pd_excel_file,
    from_time,
    to_time,
    measurement_type,
    catchment_area,
    catchment_area_factor,
    fet_id,
    fill_missing_eflows,
    forecast_discharge_levels_ts,
    low_flow_method,
    low_flow_method_freq,
    use_fish_coeff,
    station,
):
    discharge_ts, forecast_flags_ts = get_measurement_ts(
        pd_excel_file,
        SensorType.Discharge,
        measurement_type,
        from_time,
        to_time,
        fill_missing_eflows,
        forecast_discharge_levels_ts,
    )

    fet = FET.objects.get(id=fet_id)

    whole_ts = get_measurement_ts_without_filtering(
        pd_excel_file, SensorType.Discharge, measurement_type
    )
    filtered_dates = [dt for dt in whole_ts.index.tolist() if dt <= to_time]
    all_discharge_to_time_ts = whole_ts.loc[filtered_dates]

    (
        low_eflow_levels_ts,
        base_eflow_levels_ts,
        subsistence_eflow_levels_ts,
        critical_eflow_levels_ts,
    ) = calculate_eflow_threshold(
        fet,
        all_discharge_to_time_ts,
        discharge_ts.index.sort_values(),
        catchment_area,
        from_time,
        to_time,
        catchment_area_factor,
        use_fish_coeff,
        low_flow_method,
        low_flow_method_freq,
        station,
    )

    measurement_type_prefix = ""
    if measurement_type == MeasurementType.MIN:
        measurement_type_prefix = "min"
    if measurement_type == MeasurementType.AVG:
        measurement_type_prefix = "avg"
    if measurement_type == MeasurementType.MAX:
        measurement_type_prefix = "max"

    eflow_df = pd.concat(
        [
            discharge_ts,
            low_eflow_levels_ts,
            base_eflow_levels_ts,
            subsistence_eflow_levels_ts,
            critical_eflow_levels_ts,
            forecast_flags_ts,
        ],
        axis=1,
        sort=False,
    )
    eflow_df.columns = [
        f"{measurement_type_prefix}_discharge",
        f"{measurement_type_prefix}_low_eflow_level",
        f"{measurement_type_prefix}_base_eflow_level",
        f"{measurement_type_prefix}_subsistence_eflow_level",
        f"{measurement_type_prefix}_critical_eflow_level",
        f"{measurement_type_prefix}_discharge_predicted",
    ]

    return eflow_df


def get_eflow_all_types_df(
    station,
    pd_excel_file,
    from_time,
    to_time,
    catchment_area,
    catchment_area_factor,
    fet_id,
    fill_missing_eflows,
    multi_stations_eflows,
    forecast_eflows_var,
    low_flow_method,
    low_flow_method_freq,
    use_fish_coeff,
    enable_forecasting,
):
    (
        forecast_discharge_levels_ts,
        forecasting_eflows_summary_dict,
    ) = get_predicted_measurement_df(
        station,
        SensorType.Discharge,
        from_time,
        to_time,
        multi_stations_eflows,
        forecast_eflows_var,
        enable_forecasting,
    )

    min_eflow_df = get_eflows_df(
        pd_excel_file,
        from_time,
        to_time,
        MeasurementType.MIN,
        catchment_area,
        catchment_area_factor,
        fet_id,
        fill_missing_eflows,
        None,
        low_flow_method,
        low_flow_method_freq,
        use_fish_coeff,
        station,
    )

    avg_eflow_df = get_eflows_df(
        pd_excel_file,
        from_time,
        to_time,
        MeasurementType.AVG,
        catchment_area,
        catchment_area_factor,
        fet_id,
        fill_missing_eflows,
        forecast_discharge_levels_ts,
        low_flow_method,
        low_flow_method_freq,
        use_fish_coeff,
        station,
    )

    max_eflow_df = get_eflows_df(
        pd_excel_file,
        from_time,
        to_time,
        MeasurementType.MAX,
        catchment_area,
        catchment_area_factor,
        fet_id,
        fill_missing_eflows,
        None,
        low_flow_method,
        low_flow_method_freq,
        use_fish_coeff,
        station,
    )

    avg_eflow_forecast_df = pd.concat(
        [
            forecast_discharge_levels_ts,
            avg_eflow_df["avg_low_eflow_level"],
            avg_eflow_df["avg_base_eflow_level"],
            avg_eflow_df["avg_subsistence_eflow_level"],
            avg_eflow_df["avg_critical_eflow_level"],
        ],
        axis=1,
        sort=False,
    )
    avg_eflow_forecast_df.columns = [
        "avg_discharge_forecast",
        "avg_low_eflow_level_forecast",
        "avg_base_eflow_level_forecast",
        "avg_subsistence_eflow_level_forecast",
        "avg_critical_eflow_level_forecast",
    ]

    eflow_df = pd.concat(
        objs=[min_eflow_df, avg_eflow_df, max_eflow_df, avg_eflow_forecast_df],
        sort=False,
        axis=1,
    )

    return (
        eflow_df,
        forecasting_eflows_summary_dict,
    )


def get_second_axis_all_types_df(
    station,
    pd_excel_file,
    from_time,
    to_time,
    sec_axis_ts_type,
    fill_missing_sec_axis,
    multi_stations_sec_axis,
    forecast_sec_axis_var,
    enable_forecasting,
):
    (
        avg_sec_axis_forecast_ts,
        forecasting_sec_axis_summary_dict,
    ) = get_predicted_measurement_df(
        station,
        sec_axis_ts_type,
        from_time,
        to_time,
        multi_stations_sec_axis,
        forecast_sec_axis_var,
        enable_forecasting,
    )
    avg_sec_axis_forecast_ts.name = "avg_second_axis_ts_forecast"

    min_sec_axis_ts, min_sec_axis_forecast_ts = get_measurement_ts(
        pd_excel_file,
        sec_axis_ts_type,
        MeasurementType.MIN,
        from_time,
        to_time,
        fill_missing_sec_axis,
        avg_sec_axis_forecast_ts,
    )
    min_sec_axis_df = pd.concat(
        objs=[min_sec_axis_ts, min_sec_axis_forecast_ts], axis=1, sort=False,
    )
    min_sec_axis_df.columns = ["min_second_axis_ts", "min_second_axis_ts_predicted"]

    avg_sec_axis_ts, avg_sec_axis_forecast_ts = get_measurement_ts(
        pd_excel_file,
        sec_axis_ts_type,
        MeasurementType.AVG,
        from_time,
        to_time,
        fill_missing_sec_axis,
        avg_sec_axis_forecast_ts,
    )
    avg_sec_axis_df = pd.concat(
        objs=[avg_sec_axis_ts, avg_sec_axis_forecast_ts], axis=1, sort=False,
    )
    avg_sec_axis_df.columns = ["avg_second_axis_ts", "avg_second_axis_ts_predicted"]

    max_sec_axis_ts, max_sec_axis_forecast_ts = get_measurement_ts(
        pd_excel_file,
        sec_axis_ts_type,
        MeasurementType.MAX,
        from_time,
        to_time,
        fill_missing_sec_axis,
        avg_sec_axis_forecast_ts,
    )
    max_sec_axis_df = pd.concat(
        objs=[max_sec_axis_ts, max_sec_axis_forecast_ts], axis=1, sort=False,
    )
    max_sec_axis_df.columns = ["max_second_axis_ts", "max_second_axis_ts_predicted"]

    sec_axis_all_types_df = pd.concat(
        objs=[
            min_sec_axis_df,
            avg_sec_axis_df,
            max_sec_axis_df,
            avg_sec_axis_forecast_ts,
        ],
        axis=1,
        sort=False,
    )

    return (
        sec_axis_all_types_df,
        forecasting_sec_axis_summary_dict,
    )


def get_eflows_compliance(
    station,
    pd_excel_file,
    from_time,
    to_time,
    sec_axis_ts_type,
    area,
    area_factor,
    fet_id,
    fill_missings_eflows,
    fill_missing_sec_axis,
    multi_stations_eflows,
    multi_stations_sec_axis,
    forecast_eflows_var,
    forecast_sec_axis_var,
    low_flow_method,
    low_flow_method_freq,
    use_fish_coeff,
    enable_forecasting,
):
    (eflow_all_types_df, forecasting_eflows_summary_dict,) = get_eflow_all_types_df(
        station,
        pd_excel_file,
        from_time,
        to_time,
        area,
        area_factor,
        fet_id,
        fill_missings_eflows,
        multi_stations_eflows,
        forecast_eflows_var,
        low_flow_method,
        low_flow_method_freq,
        use_fish_coeff,
        enable_forecasting,
    )

    (
        sec_axis_all_types_df,
        forecasting_sec_axis_summary_dict,
    ) = get_second_axis_all_types_df(
        station,
        pd_excel_file,
        from_time,
        to_time,
        sec_axis_ts_type,
        fill_missing_sec_axis,
        multi_stations_sec_axis,
        forecast_sec_axis_var,
        enable_forecasting,
    )

    eflow_and_sec_axis_df = pd.concat(
        objs=[eflow_all_types_df, sec_axis_all_types_df], axis=1, sort=False
    )

    eflow_and_sec_axis_df["date"] = eflow_and_sec_axis_df.index

    # assign bioperiod abbreviations (for further frontend calculations)
    fet = FET.objects.filter(id=fet_id).first()
    if fet:
        eflow_and_sec_axis_df["bioperiod"] = [
            fet.bioperiods_months.get_short_bioperiod_name_by_month(date.month)
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

    forecasting_summary = {
        "forecasting_eflows": forecasting_eflows_summary_dict,
        "forecasting_sec_axis": forecasting_sec_axis_summary_dict,
    }

    return (
        eflow_and_sec_axis_df_json,
        forecasting_summary,
    )
