import React from 'react';
import PropTypes from 'prop-types';

import { Input } from 'reactstrap';
import { Switch } from '@blueprintjs/core';
import { gettext } from 'utils/text';

export const ForecastingConfiguration = ({
    fillMissingValues,
    setFillMissingValues,
    multiStationsForecast,
    setMultiStationsForecast,
    forecastVariable,
    setForecastVariable,
    axis,
}) => (
    <>
        <div className="mt-2">
            <div className="mt-3 w-100 d-flex measurement-configuration flex-column">
                <h5>{gettext('Forecast based on:')}</h5>
                <Input
                    type="select"
                    name={`forecastSelect${axis}`}
                    id={`forecastSelect${axis}`}
                    value={forecastVariable}
                    onChange={e => setForecastVariable(e.target.value)}
                >
                    <option value="Q">{gettext('Discharge')}</option>
                    <option value="TW">{gettext('Water temperature')}</option>
                    <option value="WL">{gettext('Water level')}</option>
                </Input>
            </div>
            <Switch
                className="mt-3"
                style={{ fontSize: '1.0rem' }}
                labelElement={gettext(
                    'Fill mean missing values with the forecast',
                )}
                innerLabelChecked="yes"
                innerLabel="no"
                checked={fillMissingValues}
                onChange={() => setFillMissingValues(!fillMissingValues)}
            />
            <Switch
                className="mt-1"
                style={{ fontSize: '1.0rem' }}
                labelElement={gettext(
                    'Use other stations data for forecasting',
                )}
                innerLabelChecked="yes"
                innerLabel="no"
                checked={multiStationsForecast}
                onChange={() =>
                    setMultiStationsForecast(!multiStationsForecast)
                }
            />
        </div>
    </>
);

ForecastingConfiguration.propTypes = {
    fillMissingValues: PropTypes.bool.isRequired,
    multiStationsForecast: PropTypes.bool.isRequired,
    setFillMissingValues: PropTypes.func.isRequired,
    setMultiStationsForecast: PropTypes.func.isRequired,
    forecastVariable: PropTypes.oneOf(['Q', 'TW', 'WL']).isRequired,
    setForecastVariable: PropTypes.func.isRequired,
    axis: PropTypes.string.isRequired,
};
