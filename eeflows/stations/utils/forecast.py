import datetime
import logging

import pandas as pd

from stations.constants import SensorType
from stations.utils.modelling import (
    get_algorithm_by_key,
    get_prediction,
    get_test_df,
    get_train_dfs,
)


logger = logging.getLogger(__name__)


def forecast_for_missing_values(
    df_with_missing_values, avg_eflow_forecast_df_with_compatibility
):
    bool_series = pd.isnull(df_with_missing_values)
    missing_eflows = df_with_missing_values[bool_series].copy()
    for dt, missing_value in missing_eflows.items():
        if isinstance(avg_eflow_forecast_df_with_compatibility, pd.Series):
            forecasted_value = avg_eflow_forecast_df_with_compatibility[dt]
        elif (
            isinstance(avg_eflow_forecast_df_with_compatibility, pd.DataFrame)
            and "discharge" in avg_eflow_forecast_df_with_compatibility.columns
        ):

            forecasted_value = avg_eflow_forecast_df_with_compatibility.loc[
                dt, "discharge"
            ]
        else:
            forecasted_value = avg_eflow_forecast_df_with_compatibility.loc[
                dt, "second_axis_ts"
            ]
        df_with_missing_values[dt] = forecasted_value

    return df_with_missing_values


def get_mean_values_df_by_ts_type(ts_type):
    if ts_type == SensorType.Discharge:
        path = "static/mean_values/rivers-q-mean.csv"
    elif ts_type == SensorType.WaterTemperature:
        path = "static/mean_values/rivers-TW-mean.csv"
    elif ts_type == SensorType.WaterLevel:
        path = "static/mean_values/rivers-WL-mean.csv"
    else:
        path = None

    if path:
        return pd.read_csv(path, index_col=0, parse_dates=True)

    return None


def get_predicted_measurement_df(
    station, sensor_type, from_time, to_time, multi_stations, forecast_var,
):
    from stations.utils.read_data import get_sheet_substring_sensor_type

    delta = to_time - from_time  # as timedelta
    all_dates_within = [
        from_time + datetime.timedelta(days=i) for i in range(delta.days + 1)
    ]

    forecast_df = pd.Series(index=all_dates_within, dtype="float64")

    whole_input_df = get_mean_values_df_by_ts_type(forecast_var)
    whole_output_df = get_mean_values_df_by_ts_type(sensor_type)

    same_variable = sensor_type == forecast_var

    predicted_station_name = station.name

    try:
        if whole_input_df is not None and whole_output_df is not None:
            X_train, y_train = get_train_dfs(
                whole_input_df,
                whole_output_df,
                from_time,
                to_time,
                predicted_station_name,
                multi_stations,
                same_variable,
            )
            X_test = get_test_df(
                whole_input_df,
                from_time,
                to_time,
                predicted_station_name,
                multi_stations,
                same_variable,
            )

        if (
            whole_input_df is None
            or whole_output_df is None
            or (not multi_stations and same_variable)
            or X_train is None
            or y_train is None
            or X_test is None
        ):
            message = "Not available"
            forecasting_summary = {
                "algorithm": message,
                "variable": get_sheet_substring_sensor_type(forecast_var),
                "R2": None,
                "dependent_stations": [],
            }
            return forecast_df, forecasting_summary

        else:
            if multi_stations:
                all_cols = list(set(list(X_train.columns) + list(X_test.columns)))
                cols_to_drop = [
                    col for col in all_cols if col not in X_train or col not in X_test
                ]

                if len(cols_to_drop) > 0:
                    train_cols_to_drop = [
                        col for col in X_train.columns if col in cols_to_drop
                    ]
                    test_cols_to_drop = [
                        col for col in X_test.columns if col in cols_to_drop
                    ]
                    if len(train_cols_to_drop) > 0:
                        X_train = X_train.drop(train_cols_to_drop, axis=1)
                    if len(test_cols_to_drop) > 0:
                        X_test = X_test.drop(test_cols_to_drop, axis=1)

            y_test, R2, alg, dependent_stations = get_prediction(
                X_train,
                y_train,
                X_test,
                whole_input_df,
                multi_stations,
                predicted_station_name,
            )

            forecast_df = pd.Series(y_test, index=forecast_df.index)
            forecasting_summary = {
                "algorithm": get_algorithm_by_key(alg),
                "variable": get_sheet_substring_sensor_type(forecast_var),
                "R2": R2,
                "dependent_stations": dependent_stations,
            }
            return forecast_df, forecasting_summary

    except Exception as exc:
        logger.error(f"Error while forecasting: {str(exc)}")
        message = "Error"

        forecasting_summary = {
            "algorithm": message,
            "variable": get_sheet_substring_sensor_type(forecast_var),
            "R2": None,
            "dependent_stations": [],
        }
        return forecast_df, forecasting_summary

    return None, None
