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
    get_json_with_converted_timestamp,
    get_measurement_df,
    get_measurement_df_without_filtering,
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


def calculate_second_axis_compatibility(df, ts_threshold):
    def compare_values(val, threshold):
        if not np.isnan(val) and not np.isnan(threshold):
            return val > threshold
        return np.NaN

    sec_axis_ts_comp = [
        compare_values(val, ts_threshold) for index, val in df.iteritems()
    ]
    sec_axis_comp_df = pd.Series(data=sec_axis_ts_comp, index=df.index)
    return sec_axis_comp_df


def calculate_eflow_compatibility(eflow_df):
    def compare_values(val, val_threshold):
        if not np.isnan(val) and not np.isnan(val_threshold):
            return val >= val_threshold
        return np.NaN

    exceeds_low_eflow = [
        compare_values(row["discharge"], row["low_eflow_level"])
        for index, row in eflow_df.iterrows()
    ]
    exceeds_base_eflow = [
        compare_values(row["discharge"], row["base_eflow_level"])
        for index, row in eflow_df.iterrows()
    ]
    exceeds_subsistence_eflow = [
        compare_values(row["discharge"], row["subsistence_eflow_level"])
        for index, row in eflow_df.iterrows()
    ]
    exceeds_critical_eflow = [
        compare_values(row["discharge"], row["critical_eflow_level"])
        for index, row in eflow_df.iterrows()
    ]

    exceeds_low_eflow_ts = pd.Series(
        exceeds_low_eflow, index=eflow_df.index, name="exceeds_low_eflow"
    )
    exceeds_base_eflow_ts = pd.Series(
        exceeds_base_eflow, index=eflow_df.index, name="exceeds_base_eflow"
    )
    exceeds_subsistence_eflow_ts = pd.Series(
        exceeds_subsistence_eflow,
        index=eflow_df.index,
        name="exceeds_subsistence_eflow",
    )
    exceeds_critical_eflow_ts = pd.Series(
        exceeds_critical_eflow, index=eflow_df.index, name="exceeds_critical_eflow"
    )
    return (
        exceeds_low_eflow_ts,
        exceeds_base_eflow_ts,
        exceeds_subsistence_eflow_ts,
        exceeds_critical_eflow_ts,
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
    forecast_discharge_levels_df,
    low_flow_method,
    low_flow_method_freq,
    use_fish_coeff,
    station,
):
    discharge_df, forecast_flags_df = get_measurement_df(
        pd_excel_file,
        SensorType.Discharge,
        measurement_type,
        from_time,
        to_time,
        fill_missing_eflows,
        forecast_discharge_levels_df,
    )

    fet = FET.objects.get(id=fet_id)

    whole_df = get_measurement_df_without_filtering(
        pd_excel_file, SensorType.Discharge, measurement_type
    )
    filtered_dates = [dt for dt in whole_df.index.tolist() if dt <= to_time]
    all_discharge_to_time_df = whole_df.loc[filtered_dates]

    (
        low_eflow_levels_df,
        base_eflow_levels_df,
        subsistence_eflow_levels_df,
        critical_eflow_levels_df,
    ) = calculate_eflow_threshold(
        fet,
        all_discharge_to_time_df,
        discharge_df.index.sort_values(),
        catchment_area,
        from_time,
        to_time,
        catchment_area_factor,
        use_fish_coeff,
        low_flow_method,
        low_flow_method_freq,
        station,
    )

    eflow_df = pd.concat(
        [
            discharge_df,
            low_eflow_levels_df,
            base_eflow_levels_df,
            subsistence_eflow_levels_df,
            critical_eflow_levels_df,
            forecast_flags_df,
        ],
        axis=1,
        sort=False,
    )
    eflow_df.columns = [
        "discharge",
        "low_eflow_level",
        "base_eflow_level",
        "subsistence_eflow_level",
        "critical_eflow_level",
        "discharge_predicted",
    ]

    return eflow_df


def get_second_axis_compatibility_df(
    station,
    pd_excel_file,
    from_time,
    to_time,
    sec_axis_ts_type,
    sec_axis_threshold,
    measurement_type,
    fill_missing_sec_axis,
    avg_sec_axis_forecast_df_with_compatibility,
):
    sec_axis_df, sec_axis_forecast = get_measurement_df(
        pd_excel_file,
        sec_axis_ts_type,
        measurement_type,
        from_time,
        to_time,
        fill_missing_sec_axis,
        avg_sec_axis_forecast_df_with_compatibility,
    )

    sec_axis_comp_df = calculate_second_axis_compatibility(
        sec_axis_df, sec_axis_threshold,
    )

    sec_axis_compatibility_df = pd.concat(
        [sec_axis_df, sec_axis_forecast, sec_axis_comp_df], axis=1, sort=False
    )

    sec_axis_compatibility_df.columns = [
        "second_axis_ts",
        "second_axis_ts_predicted",
        "exceeds_second_axis_ts",
    ]
    return sec_axis_compatibility_df


def get_eflow_with_compatibility_by_type(
    pd_excel_file,
    from_time,
    to_time,
    measurement_type,
    catchment_area,
    catchment_area_factor,
    fet_id,
    fill_missing_eflows,
    forecast_discharge_levels_df,
    low_flow_method,
    low_flow_method_freq,
    use_fish_coeff,
    station,
    name=None,
):
    eflow_df = get_eflows_df(
        pd_excel_file,
        from_time,
        to_time,
        measurement_type,
        catchment_area,
        catchment_area_factor,
        fet_id,
        fill_missing_eflows,
        forecast_discharge_levels_df,
        low_flow_method,
        low_flow_method_freq,
        use_fish_coeff,
        station,
    )
    (
        low_eflow_compatibility_ts,
        base_eflow_compatibility_ts,
        subsistence_eflow_compatibility_ts,
        critical_eflow_compatibility_ts,
    ) = calculate_eflow_compatibility(eflow_df)

    eflow_df_with_compatibility = pd.concat(
        [
            eflow_df,
            low_eflow_compatibility_ts,
            base_eflow_compatibility_ts,
            subsistence_eflow_compatibility_ts,
            critical_eflow_compatibility_ts,
        ],
        axis=1,
        sort=False,
    )
    if name:
        eflow_df_with_compatibility.name = name
    return eflow_df_with_compatibility


def get_avg_eflow_forecast_df_with_compatibility(
    forecast_discharge_levels_df, avg_eflow_df_with_compatibility,
):
    bioperiod_eflow_df = pd.concat(
        [
            forecast_discharge_levels_df,
            avg_eflow_df_with_compatibility["low_eflow_level"],
            avg_eflow_df_with_compatibility["base_eflow_level"],
            avg_eflow_df_with_compatibility["subsistence_eflow_level"],
            avg_eflow_df_with_compatibility["critical_eflow_level"],
        ],
        axis=1,
        sort=False,
    )
    bioperiod_eflow_df.columns = [
        "discharge",
        "low_eflow_level",
        "base_eflow_level",
        "subsistence_eflow_level",
        "critical_eflow_level",
    ]

    (
        low_eflow_compatibility_ts,
        base_eflow_compatibility_ts,
        subsistence_eflow_compatibility_ts,
        critical_eflow_compatibility_ts,
    ) = calculate_eflow_compatibility(bioperiod_eflow_df)

    eflow_forecast_df_with_compatibility = pd.concat(
        [
            bioperiod_eflow_df,
            low_eflow_compatibility_ts,
            base_eflow_compatibility_ts,
            subsistence_eflow_compatibility_ts,
            critical_eflow_compatibility_ts,
        ],
        axis=1,
        sort=False,
    )

    return eflow_forecast_df_with_compatibility


def get_avg_second_axis_forecast_compatibility_df(
    station,
    from_time,
    to_time,
    sec_axis_ts_type,
    sec_axis_threshold,
    multi_stations_sec_axis,
    forecast_sec_axis_var,
):
    sec_axis_forecast_df, forecasting_sec_axis = get_predicted_measurement_df(
        station,
        sec_axis_ts_type,
        from_time,
        to_time,
        multi_stations_sec_axis,
        forecast_sec_axis_var,
    )

    sec_axis_comp_df = calculate_second_axis_compatibility(
        sec_axis_forecast_df, sec_axis_threshold
    )

    sec_axis_compatibility_df = pd.concat(
        [sec_axis_forecast_df, sec_axis_comp_df], axis=1, sort=False
    )
    sec_axis_compatibility_df.index = sec_axis_forecast_df.index
    sec_axis_compatibility_df.columns = [
        "second_axis_ts",
        "exceeds_second_axis_ts",
    ]
    return sec_axis_compatibility_df, forecasting_sec_axis


def get_eflow_with_compatibility_all_types(
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
):
    forecast_discharge_levels_df, forecasting_eflows = get_predicted_measurement_df(
        station,
        SensorType.Discharge,
        from_time,
        to_time,
        multi_stations_eflows,
        forecast_eflows_var,
    )

    min_eflow_df_with_compatibility = get_eflow_with_compatibility_by_type(
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
    avg_eflow_df_with_compatibility = get_eflow_with_compatibility_by_type(
        pd_excel_file,
        from_time,
        to_time,
        MeasurementType.AVG,
        catchment_area,
        catchment_area_factor,
        fet_id,
        fill_missing_eflows,
        forecast_discharge_levels_df,
        low_flow_method,
        low_flow_method_freq,
        use_fish_coeff,
        station,
    )
    max_eflow_df_with_compatibility = get_eflow_with_compatibility_by_type(
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

    avg_eflow_forecast_df_with_compatibility = get_avg_eflow_forecast_df_with_compatibility(
        forecast_discharge_levels_df, avg_eflow_df_with_compatibility,
    )

    return (
        min_eflow_df_with_compatibility,
        avg_eflow_df_with_compatibility,
        max_eflow_df_with_compatibility,
        avg_eflow_forecast_df_with_compatibility,
        forecasting_eflows,
    )


def get_second_axis_with_compatibility_all_types(
    station,
    pd_excel_file,
    from_time,
    to_time,
    sec_axis_ts_type,
    sec_axis_threshold,
    fill_missing_sec_axis,
    multi_stations_sec_axis,
    forecast_sec_axis_var,
):
    (
        avg_sec_axis_forecast_df_with_compatibility,
        forecasting_sec_axis,
    ) = get_avg_second_axis_forecast_compatibility_df(
        station,
        from_time,
        to_time,
        sec_axis_ts_type,
        sec_axis_threshold,
        multi_stations_sec_axis,
        forecast_sec_axis_var,
    )

    min_sec_axis_df_with_compatibility = get_second_axis_compatibility_df(
        station,
        pd_excel_file,
        from_time,
        to_time,
        sec_axis_ts_type,
        sec_axis_threshold,
        MeasurementType.MIN,
        fill_missing_sec_axis,
        avg_sec_axis_forecast_df_with_compatibility,
    )
    avg_sec_axis_df_with_compatibility = get_second_axis_compatibility_df(
        station,
        pd_excel_file,
        from_time,
        to_time,
        sec_axis_ts_type,
        sec_axis_threshold,
        MeasurementType.AVG,
        fill_missing_sec_axis,
        avg_sec_axis_forecast_df_with_compatibility,
    )
    max_sec_axis_df_with_compatibility = get_second_axis_compatibility_df(
        station,
        pd_excel_file,
        from_time,
        to_time,
        sec_axis_ts_type,
        sec_axis_threshold,
        MeasurementType.MAX,
        fill_missing_sec_axis,
        avg_sec_axis_forecast_df_with_compatibility,
    )

    return (
        min_sec_axis_df_with_compatibility,
        avg_sec_axis_df_with_compatibility,
        max_sec_axis_df_with_compatibility,
        avg_sec_axis_forecast_df_with_compatibility,
        forecasting_sec_axis,
    )


def create_formatted_df(df, columns, measurement_key, forecasting=None):
    formatted_df = pd.DataFrame()
    for col in columns:
        if not forecasting:
            formatted_df[f"{measurement_key}_{col}"] = df[col]
        else:
            formatted_df[f"{measurement_key}_{col}_forecast"] = df[col]
    return formatted_df


def get_eflows_with_compatibility(
    station,
    pd_excel_file,
    from_time,
    to_time,
    sec_axis_ts_type,
    sec_axis_threshold,
    catchment_area,
    catchment_area_factor,
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
):
    (
        min_eflow_df_with_compatibility,
        avg_eflow_df_with_compatibility,
        max_eflow_df_with_compatibility,
        avg_eflow_forecast_df_with_compatibility,
        forecasting_eflows,
    ) = get_eflow_with_compatibility_all_types(
        station,
        pd_excel_file,
        from_time,
        to_time,
        catchment_area,
        catchment_area_factor,
        fet_id,
        fill_missings_eflows,
        multi_stations_eflows,
        forecast_eflows_var,
        low_flow_method,
        low_flow_method_freq,
        use_fish_coeff,
    )

    (
        min_sec_axis_df_with_compatibility,
        avg_sec_axis_df_with_compatibility,
        max_sec_axis_df_with_compatibility,
        avg_sec_axis_forecast_df_with_compatibility,
        forecasting_sec_axis,
    ) = get_second_axis_with_compatibility_all_types(
        station,
        pd_excel_file,
        from_time,
        to_time,
        sec_axis_ts_type,
        sec_axis_threshold,
        fill_missing_sec_axis,
        multi_stations_sec_axis,
        forecast_sec_axis_var,
    )

    eflow_columns = [
        df.columns.values
        for df in [
            min_eflow_df_with_compatibility,
            avg_eflow_df_with_compatibility,
            max_eflow_df_with_compatibility,
        ]
        # if not df.empty
    ]

    sec_axis_columns = [
        df.columns.values
        for df in [
            min_sec_axis_df_with_compatibility,
            avg_sec_axis_df_with_compatibility,
            max_sec_axis_df_with_compatibility,
        ]
        # if not df.empty
    ]

    eflow_columns = np.concatenate(eflow_columns, axis=None)
    sec_axis_columns = np.concatenate(sec_axis_columns, axis=None)

    eflow_columns = list(set(eflow_columns))
    sec_axis_columns = list(set(sec_axis_columns))

    formatted_dfs = [
        create_formatted_df(min_eflow_df_with_compatibility, eflow_columns, "min"),
        create_formatted_df(avg_eflow_df_with_compatibility, eflow_columns, "avg"),
        create_formatted_df(max_eflow_df_with_compatibility, eflow_columns, "max"),
        create_formatted_df(
            avg_eflow_forecast_df_with_compatibility,
            avg_eflow_forecast_df_with_compatibility.columns,
            "avg",
            True,
        ),
        create_formatted_df(
            min_sec_axis_df_with_compatibility, sec_axis_columns, "min"
        ),
        create_formatted_df(
            avg_sec_axis_df_with_compatibility, sec_axis_columns, "avg"
        ),
        create_formatted_df(
            max_sec_axis_df_with_compatibility, sec_axis_columns, "max"
        ),
        create_formatted_df(
            avg_sec_axis_forecast_df_with_compatibility,
            avg_sec_axis_forecast_df_with_compatibility.columns,
            "avg",
            True,
        ),
    ]

    eflow_and_sec_axis_df_with_compatibility = pd.concat(
        formatted_dfs, axis=1, sort=False
    )

    eflow_and_sec_axis_df_with_compatibility = (
        eflow_and_sec_axis_df_with_compatibility.reset_index()
    )
    eflow_and_sec_axis_df_with_compatibility = eflow_and_sec_axis_df_with_compatibility.rename(
        columns={"index": "date"}
    )
    eflow_and_sec_axis_df_with_compatibility = eflow_and_sec_axis_df_with_compatibility.rename(
        columns={"Date": "date"}
    )

    # assign bioperiod abbreviations (for further frontend calculations)
    fet = FET.objects.filter(id=fet_id).first()
    if fet:
        eflow_and_sec_axis_df_with_compatibility["bioperiod"] = [
            fet.bioperiods_months.get_short_bioperiod_name_by_month(date.month)
            for date in eflow_and_sec_axis_df_with_compatibility["date"]
        ]
    else:
        eflow_and_sec_axis_df_with_compatibility["bioperiod"] = []

    return (
        eflow_and_sec_axis_df_with_compatibility,
        forecasting_eflows,
        forecasting_sec_axis,
    )


def get_eflows_compliance(
    station,
    pd_excel_file,
    from_time,
    to_time,
    sec_axis_ts_type,
    sec_axis_threshold,
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
):
    (
        eflow_and_sec_axis_df_with_compatibility,
        forecasting_eflows,
        forecasting_sec_axis,
    ) = get_eflows_with_compatibility(
        station,
        pd_excel_file,
        from_time,
        to_time,
        sec_axis_ts_type,
        sec_axis_threshold,
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
    )

    eflow_and_sec_axis_df_with_compatibility_json = get_json_with_converted_timestamp(
        eflow_and_sec_axis_df_with_compatibility
    )

    forecasting_summary = {
        "forecasting_eflows": forecasting_eflows,
        "forecasting_sec_axis": forecasting_sec_axis,
    }

    return (
        eflow_and_sec_axis_df_with_compatibility_json,
        forecasting_summary,
    )
