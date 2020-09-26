export const getEflowValueByType = (point, eflowType, isForecast) => {
    let value;
    let threshold;

    if (isForecast) {
        // Forecast values
        value = point.avg_discharge_forecast;

        switch (eflowType) {
            case 'BASE': {
                threshold = point.avg_base_eflow_level_forecast;
                break;
            }
            case 'SUBSISTENCE': {
                threshold = point.avg_subsistence_eflow_level_forecast;
                break;
            }
            case 'CRITICAL': {
                threshold = point.avg_critical_eflow_level_forecast;
                break;
            }
            default:
                threshold = point.avg_low_eflow_level_forecast;
                break;
        }
    } else {
        // Observations
        value = point.avg_discharge;

        switch (eflowType) {
            case 'BASE': {
                threshold = point.avg_base_eflow_level;
                break;
            }
            case 'SUBSISTENCE': {
                threshold = point.avg_subsistence_eflow_level;
                break;
            }
            case 'CRITICAL': {
                threshold = point.avg_critical_eflow_level;
                break;
            }
            default:
                threshold = point.avg_low_eflow_level;
                break;
        }
    }

    return { value, threshold };
};

export const getSecondaryAxisTSValue = (point, threshold, isForecast) => {
    let value;

    if (isForecast) {
        // Forecast values
        value = point.avg_second_axis_ts_forecast;
    } else {
        value = point.avg_second_axis_ts;
    }

    return { value, threshold };
};
