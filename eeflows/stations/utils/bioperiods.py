import datetime

import numpy as np
import pandas as pd

from stations.constants import (
    BIOPERIODS,
    BioPeriodType,
    MeanLowFlowMethod,
    MeanLowFlowMethodFrequency,
    MONTHS,
    SUMMER_MONTHS,
    WINTER_MONTHS,
)


def get_bioperiod_by_number(number):
    bioperiod_name = [bp[1] for bp in BIOPERIODS if bp[0] == number]
    if len(bioperiod_name) > 0:
        bioperiod_name = bioperiod_name[0]
        if bioperiod_name == BioPeriodType.OVERWINTERING.value:
            return BioPeriodType.OVERWINTERING
        if bioperiod_name == BioPeriodType.SPRING_SPAWNING.value:
            return BioPeriodType.SPRING_SPAWNING
        if bioperiod_name == BioPeriodType.REARING.value:
            return BioPeriodType.REARING
        if bioperiod_name == BioPeriodType.FALL_SPAWNING.value:
            return BioPeriodType.FALL_SPAWNING
    return None


def get_bioperiod_start_dates_within(bioperiod_months_obj, from_time, to_time):
    get_bioperiod_start_dates = (
        list()
    )  # starting dates of bioperiods within from_time and to_time
    for year in range(from_time.year, to_time.year + 1):
        for bp_number in range(1, len(BIOPERIODS) + 1):  # from 1 to 4 (4 bioperiods)
            bioperiod_type = get_bioperiod_by_number(bp_number)
            # get the date of bioperiod start
            bioperiod_months = bioperiod_months_obj.get_months_by_bioperiod(
                bioperiod_type
            )
            if len(bioperiod_months) < 1:
                return []
            bp_start_month = bioperiod_months[0]
            bp_start_date = datetime.date(year, bp_start_month, 1)

            start_bp_number = bp_number
            if start_bp_number == 1:
                end_bp_number = len(BIOPERIODS)
            else:
                end_bp_number = start_bp_number - 1
            start_bp_name = [bp[1] for bp in BIOPERIODS if bp[0] == start_bp_number][0]
            end_bp_name = [bp[1] for bp in BIOPERIODS if bp[0] == end_bp_number][0]

            if from_time <= bp_start_date <= to_time:
                get_bioperiod_start_dates.append(
                    {
                        "date": str(bp_start_date),
                        "label": f"{end_bp_name}/{start_bp_name}",
                    }
                )

    return get_bioperiod_start_dates


def get_fish_coeff_by_bioperiod_and_flow_type(fet, bioperiod, flow_type):
    flow_p_coefficients = fet.get_fish_coeff_by_flow_type(flow_type)
    if bioperiod == BioPeriodType.OVERWINTERING:
        return flow_p_coefficients.winter
    if bioperiod == BioPeriodType.SPRING_SPAWNING:
        return flow_p_coefficients.spring
    if bioperiod == BioPeriodType.REARING:
        return flow_p_coefficients.summer
    if bioperiod == BioPeriodType.FALL_SPAWNING:
        return flow_p_coefficients.autumn
    return None


def get_full_bioperiod_range(bioperiod_months, from_time, to_time):
    from_year = from_time.year
    from_month = from_time.month
    to_year = to_time.year
    to_month = to_time.month

    from_bioperiod = bioperiod_months.get_bioperiod_by_month(from_month)
    from_bioperiod_months = bioperiod_months.get_months_by_bioperiod(from_bioperiod)

    to_bioperiod = bioperiod_months.get_bioperiod_by_month(to_month)
    to_bioperiod_months = bioperiod_months.get_months_by_bioperiod(to_bioperiod)

    if len(from_bioperiod_months) > 0 and len(to_bioperiod_months) > 0:
        from_bioperiod_months.sort(reverse=False)
        to_bioperiod_months.sort(reverse=True)

        first_month = from_bioperiod_months[0]
        last_month = to_bioperiod_months[0]
        from_time_bioperiod = datetime.date(from_year, first_month, 1)

        def last_day_of_month(any_day):
            next_month = any_day.replace(day=28) + datetime.timedelta(days=4)
            return next_month - datetime.timedelta(days=next_month.day)

        to_time_bioperiod = last_day_of_month(datetime.date(to_year, last_month, 1))

        return from_time_bioperiod, to_time_bioperiod

    return from_time, to_time


def get_low_flow_value(period_df, low_flow_method, proportion):
    values = period_df.dropna()

    if "EXCEED" in low_flow_method.value:
        values = values.sort_values(ascending=False)
        idx = int((1 - proportion) * len(values)) - 1
        if idx < 0:
            idx = 0
        return period_df.iloc[idx]
    else:
        return values.mean()


def get_mean_low_flow_periods(
    all_discharge_to_time_df,
    time_axis,
    fet,
    low_flow_method,
    low_flow_method_freq,
    proportion,
):
    if low_flow_method_freq == MeanLowFlowMethodFrequency.LongTerm:
        all_values_dict = dict()
        all_dates_dict = dict()

        all_mean = get_low_flow_value(
            all_discharge_to_time_df, low_flow_method, proportion
        )
        all_values_dict["all"] = all_mean
        all_dates_dict["all"] = time_axis

        return all_values_dict, all_dates_dict

    if low_flow_method_freq == MeanLowFlowMethodFrequency.Seasonal:
        season_values_dict = dict()
        season_dates_dict = dict()

        summer_months = [month_tuple[0] for month_tuple in SUMMER_MONTHS]
        winter_months = [month_tuple[0] for month_tuple in WINTER_MONTHS]

        all_summer_dates = [
            dt
            for dt in all_discharge_to_time_df.index.tolist()
            if dt.month in summer_months
        ]
        all_summer_mean = get_low_flow_value(
            all_discharge_to_time_df.loc[all_summer_dates], low_flow_method, proportion
        )

        season_values_dict["summer"] = all_summer_mean
        season_dates_dict["summer"] = [
            dt for dt in time_axis if dt.month in summer_months
        ]

        all_winter_dates = [
            dt
            for dt in all_discharge_to_time_df.index.tolist()
            if dt.month in winter_months
        ]
        all_winter_mean = get_low_flow_value(
            all_discharge_to_time_df.loc[all_winter_dates], low_flow_method, proportion
        )

        season_values_dict["winter"] = all_winter_mean
        season_dates_dict["winter"] = [
            dt for dt in time_axis if dt.month in winter_months
        ]

        return season_values_dict, season_dates_dict

    if low_flow_method_freq == MeanLowFlowMethodFrequency.Bioperiodical:
        bioperiod_values_dict = dict()
        bioperiod_dates_dict = dict()

        for bioperiod in BIOPERIODS:
            bioperiod_num = bioperiod[0]
            bioperiod_name = bioperiod[1]

            # take each bioperiod months
            if bioperiod_num == 1:
                months = fet.bioperiods_months.get_months_by_bioperiod(
                    BioPeriodType.OVERWINTERING
                )
            elif bioperiod_num == 2:
                months = fet.bioperiods_months.get_months_by_bioperiod(
                    BioPeriodType.SPRING_SPAWNING
                )
            elif bioperiod_num == 3:
                months = fet.bioperiods_months.get_months_by_bioperiod(
                    BioPeriodType.REARING
                )
            elif bioperiod_num == 4:
                months = fet.bioperiods_months.get_months_by_bioperiod(
                    BioPeriodType.FALL_SPAWNING
                )
            else:
                continue

            all_bioperiod_dates = [
                dt
                for dt in all_discharge_to_time_df.index.tolist()
                if dt.month in months
            ]
            all_bioperiod_mean = get_low_flow_value(
                all_discharge_to_time_df.loc[all_bioperiod_dates],
                low_flow_method,
                proportion,
            )

            bioperiod_values_dict[bioperiod_name] = all_bioperiod_mean
            bioperiod_dates_dict[bioperiod_name] = [
                dt for dt in time_axis if dt.month in months
            ]

        return bioperiod_values_dict, bioperiod_dates_dict

        # choose parts from the time axis
    if low_flow_method_freq == MeanLowFlowMethodFrequency.Monthly:
        month_values_dict = dict()
        month_dates_dict = dict()

        for month_tuple in MONTHS:
            month_num = month_tuple[0]
            month_name = month_tuple[1]

            all_month_dates = [
                dt
                for dt in all_discharge_to_time_df.index.tolist()
                if dt.month == month_num
            ]
            all_month_mean = get_low_flow_value(
                all_discharge_to_time_df.loc[all_month_dates],
                low_flow_method,
                proportion,
            )

            month_values_dict[month_name] = all_month_mean
            month_dates_dict[month_name] = [
                dt for dt in time_axis if dt.month == month_num
            ]

        return month_values_dict, month_dates_dict

    return None, None


def get_mean_low_flows(
    low_flow_method_freq, values_dict, dates_dict, mean_bioperiod_discharge_df
):
    if low_flow_method_freq == MeanLowFlowMethodFrequency.LongTerm:
        mean_bioperiod_discharge_df.loc[
            dates_dict["all"], "mean bioperiod discharge"
        ] = [values_dict["all"] for _ in dates_dict["all"]]

    if low_flow_method_freq == MeanLowFlowMethodFrequency.Seasonal:
        mean_bioperiod_discharge_df.loc[
            dates_dict["summer"], "mean bioperiod discharge"
        ] = [values_dict["summer"] for _ in dates_dict["summer"]]
        mean_bioperiod_discharge_df.loc[
            dates_dict["winter"], "mean bioperiod discharge"
        ] = [values_dict["winter"] for _ in dates_dict["winter"]]

    if low_flow_method_freq == MeanLowFlowMethodFrequency.Bioperiodical:
        mean_bioperiod_discharge_df.loc[
            dates_dict[BioPeriodType.OVERWINTERING.value], "mean bioperiod discharge"
        ] = [
            values_dict[BioPeriodType.OVERWINTERING.value]
            for _ in dates_dict[BioPeriodType.OVERWINTERING.value]
        ]
        mean_bioperiod_discharge_df.loc[
            dates_dict[BioPeriodType.SPRING_SPAWNING.value], "mean bioperiod discharge"
        ] = [
            values_dict[BioPeriodType.SPRING_SPAWNING.value]
            for _ in dates_dict[BioPeriodType.SPRING_SPAWNING.value]
        ]
        mean_bioperiod_discharge_df.loc[
            dates_dict[BioPeriodType.REARING.value], "mean bioperiod discharge"
        ] = [
            values_dict[BioPeriodType.REARING.value]
            for _ in dates_dict[BioPeriodType.REARING.value]
        ]
        mean_bioperiod_discharge_df.loc[
            dates_dict[BioPeriodType.FALL_SPAWNING.value], "mean bioperiod discharge"
        ] = [
            values_dict[BioPeriodType.FALL_SPAWNING.value]
            for _ in dates_dict[BioPeriodType.FALL_SPAWNING.value]
        ]

        # choose parts from the time axis
    if low_flow_method_freq == MeanLowFlowMethodFrequency.Monthly:
        for month_tuple in MONTHS:
            month_name = month_tuple[1]

            mean_bioperiod_discharge_df.loc[
                dates_dict[month_name], "mean bioperiod discharge"
            ] = [values_dict[month_name] for _ in dates_dict[month_name]]

    return mean_bioperiod_discharge_df


def get_low_flow_series(
    all_discharge_to_time_df, time_axis, fet, low_flow_method, low_flow_method_freq
):
    low_flow_thresholds_df = pd.DataFrame(
        index=time_axis, columns=["mean bioperiod discharge"]
    )

    proportion = 0.95  # default
    if low_flow_method == MeanLowFlowMethod.Tennant30:
        proportion = 0.3

    elif low_flow_method == MeanLowFlowMethod.Tennant20:
        proportion = 0.2

    elif low_flow_method == MeanLowFlowMethod.ExceedanceProbability95:
        proportion = 0.95

    elif low_flow_method == MeanLowFlowMethod.ExceedanceProbability75:
        proportion = 0.75

    values_dict, dates_dict = get_mean_low_flow_periods(
        all_discharge_to_time_df,
        time_axis,
        fet,
        low_flow_method,
        low_flow_method_freq,
        proportion,
    )

    low_flow_thresholds_df = get_mean_low_flows(
        low_flow_method_freq, values_dict, dates_dict, low_flow_thresholds_df
    )

    low_flow_thresholds_ts = low_flow_thresholds_df.iloc[
        :, 0
    ]  # get pd.Series from pd.DataFrame
    return low_flow_thresholds_ts


def get_eflows_all_types(all_discharge_to_time_df):
    base_value = np.NaN
    subsistence_value = np.NaN
    critical_value = np.NaN

    temp_q_df = all_discharge_to_time_df.copy()
    temp_q_df.dropna(inplace=True)

    if not temp_q_df.empty:
        # filter discharge by low pulses (long-term mean) and get exceedance probabilities
        long_term_mean = np.mean(temp_q_df.values)
        count_all = len(temp_q_df)
        sorted_q_values = temp_q_df.sort_values(ascending=True).values
        ranks_minus_1 = list(range(len(sorted_q_values)))  # indices
        exceedance_probabilities = [
            (m + 1) / (count_all + 1)
            if sorted_q_values[m] <= long_term_mean
            else np.NaN
            for m in ranks_minus_1
        ]

        # get percentages of different types of flows
        crossing_point_prob = max(
            [prob for prob in exceedance_probabilities if prob != np.NaN]
        )
        p_subsistence = 0.25 * crossing_point_prob
        p_critical = 0.5 * crossing_point_prob
        p_base = 0.75 * crossing_point_prob

        # get the closest exceedance probability from the existing ones
        exceedance_prob_arr = np.asarray(
            [prob for prob in exceedance_probabilities if np.isfinite(prob)]
        )
        base_idx = (np.abs(exceedance_prob_arr - p_base)).argmin()
        subsistence_idx = (np.abs(exceedance_prob_arr - p_subsistence)).argmin()
        critical_idx = (np.abs(exceedance_prob_arr - p_critical)).argmin()

        base_value = sorted_q_values[base_idx]
        subsistence_value = sorted_q_values[subsistence_idx]
        critical_value = sorted_q_values[critical_idx]

    dates_idx = all_discharge_to_time_df.index

    base_eflow_ts = pd.Series(
        data=[base_value for _ in list(dates_idx)], index=dates_idx
    )
    subsistence_eflow_ts = pd.Series(
        data=[subsistence_value for _ in list(dates_idx)], index=dates_idx
    )
    critical_eflow_ts = pd.Series(
        data=[critical_value for _ in list(dates_idx)], index=dates_idx
    )
    return base_eflow_ts, subsistence_eflow_ts, critical_eflow_ts
