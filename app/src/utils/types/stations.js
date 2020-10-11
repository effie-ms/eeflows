import PropTypes from 'prop-types';

export const FishCoefficientsShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    winter: PropTypes.number.isRequired,
    summer: PropTypes.number.isRequired,
    spring: PropTypes.number.isRequired,
    autumn: PropTypes.number.isRequired,
});

export const FETShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    fet_name: PropTypes.string.isRequired,
    fet_short_label: PropTypes.string.isRequired,
});

export const FETInfoShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    fet_name: PropTypes.string.isRequired,
    fet_short_label: PropTypes.string.isRequired,
    base_p_coefficients: FishCoefficientsShape.isRequired,
    critical_p_coefficients: FishCoefficientsShape.isRequired,
    subsistence_p_coefficients: FishCoefficientsShape.isRequired,
});

export const StationShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    river_FET: FETShape.isRequired,
    river_body: PropTypes.string.isRequired,
    catchment_area: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
});

export const EflowsShape = PropTypes.shape({
    date: PropTypes.string.isRequired,
    bioperiod: PropTypes.oneOf(['OW', 'SS', 'RG', 'FS']),
    min_discharge: PropTypes.number,
    avg_discharge: PropTypes.number,
    avg_discharge_forecast: PropTypes.number,
    max_discharge: PropTypes.number,
    discharge_range: PropTypes.arrayOf(PropTypes.number),
    low_eflows_level_range: PropTypes.arrayOf(PropTypes.number),
    base_eflows_level_range: PropTypes.arrayOf(PropTypes.number),
    subsistence_eflows_level_range: PropTypes.arrayOf(PropTypes.number),
    critical_eflows_level_range: PropTypes.arrayOf(PropTypes.number),
    min_low_eflow_level: PropTypes.number,
    avg_low_eflow_level: PropTypes.number,
    max_low_eflow_level: PropTypes.number,
    avg_low_eflow_level_forecast: PropTypes.number,
    min_base_eflow_level: PropTypes.number,
    avg_base_eflow_level: PropTypes.number,
    max_base_eflow_level: PropTypes.number,
    avg_base_eflow_level_forecast: PropTypes.number,
    min_subsistence_eflow_level: PropTypes.number,
    avg_subsistence_eflow_level: PropTypes.number,
    max_subsistence_eflow_level: PropTypes.number,
    avg_subsistence_eflow_level_forecast: PropTypes.number,
    min_critical_eflow_level: PropTypes.number,
    avg_critical_eflow_level: PropTypes.number,
    max_critical_eflow_level: PropTypes.number,
    avg_critical_eflow_level_forecast: PropTypes.number,
    min_discharge_predicted: PropTypes.boolean,
    avg_discharge_predicted: PropTypes.boolean,
    max_discharge_predicted: PropTypes.boolean,
    min_second_axis_ts: PropTypes.number,
    max_second_axis_ts: PropTypes.number,
    avg_second_axis_ts: PropTypes.number,
    avg_second_axis_ts_forecast: PropTypes.number,
    second_axis_ts_range: PropTypes.arrayOf(PropTypes.number),
    min_second_axis_ts_predicted: PropTypes.boolean,
    avg_second_axis_ts_predicted: PropTypes.boolean,
    max_second_axis_ts_predicted: PropTypes.boolean,
});

export const BioperiodBoundaryShape = PropTypes.shape({
    date: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
});

export const ForecastingSummaryVariableShape = PropTypes.shape({
    algorithm: PropTypes.string,
    variable: PropTypes.string,
    R2: PropTypes.number,
    dependent_stations: PropTypes.arrayOf(PropTypes.string),
});

export const ForecastingSummaryShape = PropTypes.shape({
    forecasting_eflows: ForecastingSummaryVariableShape,
    forecasting_sec_axis: ForecastingSummaryVariableShape,
});

export const EflowsResponseShape = PropTypes.shape({
    from_time: PropTypes.string.isRequired,
    to_time: PropTypes.string.isRequired,
    second_axis_time_series_type: PropTypes.string.isRequired,
    fill_missing_eflows: PropTypes.bool.isRequired,
    fill_missing_sec_axis: PropTypes.bool.isRequired,
    multi_stations_eflows: PropTypes.bool.isRequired,
    multi_stations_sec_axis: PropTypes.bool.isRequired,
    forecast_eflows_var: PropTypes.string.isRequired,
    forecast_sec_axis_var: PropTypes.string.isRequired,
    area: PropTypes.number.isRequired,
    area_factor: PropTypes.number.isRequired,
    low_flow_method: PropTypes.oneOf(['TNT30', 'TNT20', 'EXCEED95', 'EXCEED75'])
        .isRequired,
    low_flow_method_freq: PropTypes.oneOf([
        'LONG-TERM',
        'SEASONAL',
        'BIOPERIOD',
        'MONTHLY',
    ]).isRequired,
    use_fish_coeff: PropTypes.bool.isRequired,
    selected_fet_id: PropTypes.number.isRequired,
    eflows_ts: PropTypes.arrayOf(EflowsShape).isRequired,
    bioperiods_boundaries: PropTypes.arrayOf(BioperiodBoundaryShape),
    forecasting_summary: ForecastingSummaryShape,
});

export const StationsListShape = PropTypes.shape({
    stations_list: PropTypes.arrayOf(StationShape),
    fets: PropTypes.arrayOf(FETInfoShape),
});
