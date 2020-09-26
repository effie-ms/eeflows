import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';

import { gettext } from 'utils/text';

import { ForecastingConfiguration } from '../shared/ForecastingConfiguration';

export const ForecastingTabPane = ({
    fillMissingValuesDischarge,
    setFillMissingValuesDischarge,
    multiStationsForecastDischarge,
    setMultiStationsForecastDischarge,
    fillMissingValuesSecondAxis,
    setFillMissingValuesSecondAxis,
    multiStationsForecastSecondAxis,
    setMultiStationsForecastSecondAxis,
    forecastEflowsVariable,
    setForecastEflowsVariable,
    forecastSecondAxisVariable,
    setForecastSecondAxisVariable,
}) => (
    <div className="d-flex flex-row justify-content-between mt-3">
        <div className="m-3" style={{ flexBasis: '25%' }}>
            <Button style={{ opacity: 1 }} color="dark" outline disabled>
                <h4 className="mb-0">{gettext('Primary axis')}</h4>
            </Button>
            <ForecastingConfiguration
                fillMissingValues={fillMissingValuesDischarge}
                multiStationsForecast={multiStationsForecastDischarge}
                setFillMissingValues={setFillMissingValuesDischarge}
                setMultiStationsForecast={setMultiStationsForecastDischarge}
                forecastVariable={forecastEflowsVariable}
                setForecastVariable={setForecastEflowsVariable}
                axis="primary"
            />
        </div>
        <div className="m-3" style={{ flexBasis: '25%' }}>
            <Button style={{ opacity: 1 }} color="dark" outline disabled>
                <h4 className="mb-0">{gettext('Secondary axis')}</h4>
            </Button>
            <ForecastingConfiguration
                fillMissingValues={fillMissingValuesSecondAxis}
                multiStationsForecast={multiStationsForecastSecondAxis}
                setFillMissingValues={setFillMissingValuesSecondAxis}
                setMultiStationsForecast={setMultiStationsForecastSecondAxis}
                forecastVariable={forecastSecondAxisVariable}
                setForecastVariable={setForecastSecondAxisVariable}
                axis="secondary"
            />
        </div>
        <div className="m-3" style={{ flexBasis: '50%', textAlign: 'justify' }}>
            <div className="bp3-callout bp3-intent-primary bp3-icon-info-sign">
                <h4 className="bp3-heading">
                    {gettext('Forecasting configuration')}
                </h4>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'Forecasting for both axes involves the use of regression algorithms for time series ' +
                            'forecasting.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'The type of the hydrological variable to base forecast on is selected from the ' +
                            '"Forecast based on" list.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        '"Use other stations data for forecasting" toggles the use of the data from other stations ' +
                            'for multivariate time series forecasting.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'If there are any missing values in the time series of the selected date range and' +
                            ' "Fill mean missing values with the forecast" is on, then the missing observations will be ' +
                            'filled with the predicted values (if the forecast is available).',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'Forecast is not available if there are more than 18 (5% of a year) missing observations ' +
                            'in the time series of the preceding the selected date range year.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'Visibility of the predicted time series can be toggled from the visualization configuration.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'After estimation, forecasting information is available under the compliance graph.',
                    )}
                </span>
            </div>
        </div>
    </div>
);

ForecastingTabPane.propTypes = {
    fillMissingValuesDischarge: PropTypes.bool.isRequired,
    setFillMissingValuesDischarge: PropTypes.func.isRequired,
    multiStationsForecastDischarge: PropTypes.bool.isRequired,
    setMultiStationsForecastDischarge: PropTypes.func.isRequired,
    fillMissingValuesSecondAxis: PropTypes.bool.isRequired,
    setFillMissingValuesSecondAxis: PropTypes.func.isRequired,
    multiStationsForecastSecondAxis: PropTypes.bool.isRequired,
    setMultiStationsForecastSecondAxis: PropTypes.func.isRequired,
    forecastEflowsVariable: PropTypes.oneOf(['Q', 'TW', 'WL']).isRequired,
    setForecastEflowsVariable: PropTypes.func.isRequired,
    forecastSecondAxisVariable: PropTypes.oneOf(['Q', 'TW', 'WL']).isRequired,
    setForecastSecondAxisVariable: PropTypes.func.isRequired,
};
