import datetime

import numpy as np
import pandas as pd
from sklearn.linear_model import Lasso, LinearRegression, Ridge


def get_algorithm_by_key(key):
    if key == "lr":
        return "Linear regression"
    if key == "lasso":
        return "Lasso regression"
    if key == "ridge":
        return "Ridge regression"

    return key


def get_available_set_by_dates(
    whole_df, from_date, to_date, train, training_period_days=365
):
    max_date = max(whole_df.index)
    min_date = min(whole_df.index)

    if train:
        from_train_dt = from_date - datetime.timedelta(days=training_period_days + 1)
        to_train_dt = from_train_dt + datetime.timedelta(days=training_period_days)
    else:
        from_train_dt = from_date
        to_train_dt = to_date

    if min_date <= from_train_dt <= max_date and min_date <= to_train_dt <= max_date:
        filtered_dates = [
            dt for dt in whole_df.index.tolist() if from_train_dt <= dt <= to_train_dt
        ]
        filtered_df = whole_df.loc[filtered_dates]
        return filtered_df

    return None


def get_multiple_columns_subset(filtered_df, max_missing_count):
    # calculate the number of NaN values in a column
    filtered_df_null = filtered_df.isnull().sum(axis=0)
    # find and drop columns with > max_missing_count NaNs
    cols_to_drop = [
        col
        for col in filtered_df_null.index
        if filtered_df_null[col] > max_missing_count
    ]

    if len(cols_to_drop) > 0:
        df = filtered_df.drop(cols_to_drop, axis=1)
        # interpolate the ones that can be interpolated
        df = df.interpolate(axis=1)
        # drop columns if not possible to interpolate entirely
        df = df.dropna(axis=1)
    else:
        df = filtered_df.copy()

    if df.empty or len(df.columns) < 1:
        return None

    return df


def get_single_column_subset(filtered_df, max_missing_count):
    filtered_df_null = filtered_df.isnull().sum()

    if filtered_df_null > max_missing_count:
        return None

    if filtered_df_null > 0:
        df = filtered_df.interpolate()
        if df.isnull().sum() > 0:
            return None
    else:
        df = filtered_df.copy()

    return df


def get_train_dfs(
    whole_input_df,
    whole_output_df,
    from_date,
    to_date,
    station_to_predict_name,
    is_multistations,
    is_same_variable,
    max_missing_count=18,
):
    if not is_multistations and is_same_variable:
        return None, None  # not supported

    input_filtered_df = get_available_set_by_dates(
        whole_input_df, from_date, to_date, True
    )
    output_filtered_df = get_available_set_by_dates(
        whole_output_df, from_date, to_date, True
    )
    if input_filtered_df is None or output_filtered_df is None:
        return None, None

    if is_multistations:
        input_filtered_df = input_filtered_df.drop(station_to_predict_name, axis=1)
        input_df = get_multiple_columns_subset(input_filtered_df, max_missing_count)
    elif not is_same_variable:
        input_filtered_df = input_filtered_df[station_to_predict_name]
        input_df = get_single_column_subset(input_filtered_df, max_missing_count)

    output_filtered_df = output_filtered_df[station_to_predict_name]
    output_df = get_single_column_subset(output_filtered_df, max_missing_count)

    if input_df is None or output_df is None:
        return None, None

    return input_df, output_df


def get_test_df(
    whole_input_df,
    from_date,
    to_date,
    station_to_predict_name,
    is_multistations,
    is_same_variable,
    max_missing_count=18,
):
    if not is_multistations and is_same_variable:
        return None  # not supported

    input_filtered_df = get_available_set_by_dates(
        whole_input_df, from_date, to_date, False
    )

    if input_filtered_df is None:
        return None

    if is_multistations:
        input_filtered_df = input_filtered_df.drop(station_to_predict_name, axis=1)
        input_df = get_multiple_columns_subset(input_filtered_df, max_missing_count)

    elif not is_same_variable:
        input_filtered_df = input_filtered_df[station_to_predict_name]
        input_df = get_single_column_subset(input_filtered_df, max_missing_count)

    if input_df is None:
        return None

    return input_df


def get_selected_features(X_train, X_test, X, station_to_predict):
    if len(X_train.columns) <= 10:
        return X_train, X_test, X_train.columns

    dist_file_name = "static/distance_matrix.xlsx"

    dist_df = pd.read_excel(
        dist_file_name, sheet_name="Normalized distances", index_col=0
    )

    corr_matrix_df = X.corr()
    dist_corr_matrix_df = corr_matrix_df.copy()

    for idx, row in corr_matrix_df.iterrows():
        for col in corr_matrix_df.columns:
            if idx == col:
                dist_corr_matrix_df.loc[idx, col] = 1
            elif not np.isnan(dist_corr_matrix_df.loc[idx, col]):
                dist_corr_matrix_df.loc[idx, col] = (
                    np.abs(corr_matrix_df.loc[idx, col]) + (1 - dist_df.loc[idx, col])
                ) / 2

    weights = dist_corr_matrix_df[station_to_predict]
    sorted_weights_idx = [idx for idx in weights.index if idx in X_train.columns]
    sorted_weights = weights.loc[sorted_weights_idx].sort_values(ascending=False)
    best_stations_10 = list(sorted_weights[:10].index)

    selected_X_train = X_train[best_stations_10]
    selected_X_test = X_test[best_stations_10]
    dependent_stations = best_stations_10

    return selected_X_train, selected_X_test, dependent_stations


def get_models():
    models = dict()
    models["lasso"] = Lasso()
    models["lr"] = LinearRegression()
    models["ridge"] = Ridge()
    return models


def get_sets_for_model(
    X_train_whole,
    X_test_whole,
    y_train,
    X_train_selected,
    X_test_selected,
    model_key,
    is_multistations,
):
    if is_multistations and model_key != "lasso":
        X_train = X_train_selected
        X_test = X_test_selected
    else:
        X_train = X_train_whole
        X_test = X_test_whole

    if is_multistations:
        X_train_values = X_train.values
        X_test_values = X_test.values
    else:
        X_train_values = X_train.values.reshape(-1, 1)
        X_test_values = X_test.values.reshape(-1, 1)

    y_train_values = y_train.values.reshape(-1, 1)
    if is_multistations:
        X_train_cols = X_train.columns
    else:
        X_train_cols = None
    return X_train_values, y_train_values, X_test_values, X_train_cols


def get_dependent_stations_for_model(
    X_train_cols, dependent_stations_selected, model_key, model, is_multistations
):
    if is_multistations:
        if model_key == "lasso":
            return [
                col for idx, col in enumerate(X_train_cols) if model.coef_[idx] != 0.0
            ]
        else:
            return dependent_stations_selected
    return []


def get_R2_for_model(y_train, y_pred):
    df_train_results = pd.DataFrame()
    df_train_results["ground_truth"] = y_train.ravel()
    df_train_results["predictions"] = y_pred

    correlation_matrix = np.corrcoef(
        df_train_results["predictions"], df_train_results["ground_truth"]
    )
    correlation_xy = correlation_matrix[0, 1]
    R2 = correlation_xy ** 2

    return R2


def get_prediction(
    X_train_whole, y_train, X_test_whole, X, is_multistations, station_to_predict
):
    models = get_models()

    R2_dict = dict()
    trained_models_dict = dict()
    dependent_stations_dict = dict()

    # do feature selection for linear and ridge regression
    if is_multistations:
        (
            X_train_selected,
            X_test_selected,
            dependent_stations_selected,
        ) = get_selected_features(X_train_whole, X_test_whole, X, station_to_predict)

    for key, local_model in models.items():
        if is_multistations:
            (
                X_train_values,
                y_train_values,
                X_test_values,
                X_train_cols,
            ) = get_sets_for_model(
                X_train_whole,
                X_test_whole,
                y_train,
                X_train_selected,
                X_test_selected,
                key,
                is_multistations,
            )
        else:
            (
                X_train_values,
                y_train_values,
                X_test_values,
                X_train_cols,
            ) = get_sets_for_model(
                X_train_whole, X_test_whole, y_train, None, None, key, is_multistations
            )
        local_model.fit(X_train_values, y_train_values)

        if is_multistations:
            dependent_stations_dict[key] = get_dependent_stations_for_model(
                X_train_cols,
                dependent_stations_selected,
                key,
                local_model,
                is_multistations,
            )
        else:
            dependent_stations_dict[key] = get_dependent_stations_for_model(
                X_train_cols, None, key, local_model, is_multistations
            )
        y_pred = local_model.predict(X_train_values)
        R2_dict[key] = get_R2_for_model(y_train_values, y_pred)

        trained_models_dict[key] = local_model

        if R2_dict[key] >= 0.95:
            y_test = local_model.predict(X_test_values)
            return y_test.ravel(), R2_dict[key], key, dependent_stations_dict[key]

    best_model_keys = [
        key for key, value in R2_dict.items() if value == max(R2_dict.values())
    ]
    best_key = best_model_keys[0]

    if is_multistations:
        (
            X_train_values,
            y_train_values,
            X_test_values,
            X_train_cols,
        ) = get_sets_for_model(
            X_train_whole,
            X_test_whole,
            y_train,
            X_train_selected,
            X_test_selected,
            best_key,
            is_multistations,
        )
    else:
        (
            X_train_values,
            y_train_values,
            X_test_values,
            X_train_cols,
        ) = get_sets_for_model(
            X_train_whole, X_test_whole, y_train, None, None, best_key, is_multistations
        )

    y_test = trained_models_dict[best_key].predict(X_test_values)
    return (
        y_test.ravel(),
        R2_dict[best_key],
        best_key,
        dependent_stations_dict[best_key],
    )
