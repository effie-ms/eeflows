import React from 'react';
import { gettext, getTimeSeriesNameByAbbreviation } from 'utils/text';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { ForecastingSummaryShape } from 'utils/types';
import { ProcessingState } from '../shared/ProcessingState';

export const ForecastingSummary = ({
    forecastingSummary,
    showProcessingBar,
    showSecondaryAxis,
}) => {
    const algorithmDischarge = forecastingSummary
        ? forecastingSummary.forecasting_eflows.algorithm
        : null;
    const primaryAxisAlgorithmBase = forecastingSummary
        ? forecastingSummary.forecasting_eflows.variable
        : null;
    const primaryAxisForecastR2 = forecastingSummary
        ? forecastingSummary.forecasting_eflows.R2
        : null;
    const primaryAxisDependentStations = forecastingSummary
        ? forecastingSummary.forecasting_eflows.dependent_stations
        : null;

    const secAxisForecastAlgorithm = forecastingSummary
        ? forecastingSummary.forecasting_sec_axis.algorithm
        : null;
    const secAxisAlgorithmBase = forecastingSummary
        ? forecastingSummary.forecasting_sec_axis.variable
        : null;
    const secAxisForecastR2 = forecastingSummary
        ? forecastingSummary.forecasting_sec_axis.R2
        : null;
    const secAxisDependentStations = forecastingSummary
        ? forecastingSummary.forecasting_sec_axis.dependent_stations
        : null;

    const primaryAxisForecastR2Rounded = primaryAxisForecastR2
        ? primaryAxisForecastR2.toFixed(3)
        : null;
    const secAxisForecastR2Rounded = secAxisForecastR2
        ? secAxisForecastR2.toFixed(3)
        : null;

    return (
        <div className="forecast-summary mt-5">
            <h4>{gettext('Forecasting information')}</h4>
            {showProcessingBar ? (
                <ProcessingState />
            ) : (
                <div className="d-flex flex-row justify-content-between mt-3">
                    <div style={{ flexBasis: '50%' }}>
                        <Button
                            className="mb-2"
                            style={{ opacity: 1 }}
                            color="dark"
                            outline
                            disabled
                        >
                            <h4 className="mb-0">{gettext('Primary axis')}</h4>
                        </Button>
                        <div className="ml-3">
                            <p>
                                {gettext('Algorithm: ')}
                                <span>
                                    {algorithmDischarge || 'Not available'}
                                </span>
                            </p>
                            <p>
                                {gettext('Based on: ')}
                                <span>
                                    {getTimeSeriesNameByAbbreviation(
                                        primaryAxisAlgorithmBase,
                                    ) || '-'}
                                </span>
                            </p>
                            <p>
                                {gettext('Determination coefficient (R2): ')}
                                <span>
                                    {primaryAxisForecastR2Rounded || '-'}
                                </span>
                            </p>
                            <p>
                                {gettext('Dependent stations: ')}
                                <span>
                                    {primaryAxisDependentStations &&
                                    primaryAxisDependentStations.length > 0
                                        ? primaryAxisDependentStations.join(
                                              ', ',
                                          )
                                        : '-'}
                                </span>
                            </p>
                        </div>
                    </div>
                    {showSecondaryAxis && (
                        <div style={{ flexBasis: '50%', paddingLeft: 50 }}>
                            <Button
                                className="mb-2"
                                style={{ opacity: 1 }}
                                color="dark"
                                outline
                                disabled
                            >
                                <h4 className="mb-0">
                                    {gettext('Secondary axis')}
                                </h4>
                            </Button>
                            <div className="ml-3">
                                <p>
                                    {gettext('Algorithm: ')}
                                    <span>
                                        {secAxisForecastAlgorithm ||
                                            'Not available'}
                                    </span>
                                </p>
                                <p>
                                    {gettext('Based on: ')}
                                    <span>
                                        {getTimeSeriesNameByAbbreviation(
                                            secAxisAlgorithmBase,
                                        ) || '-'}
                                    </span>
                                </p>
                                <p>
                                    {gettext(
                                        'Determination coefficient (R2): ',
                                    )}
                                    <span>
                                        {secAxisForecastR2Rounded || '-'}
                                    </span>
                                </p>
                                <p>
                                    {gettext('Dependent stations: ')}
                                    <span>
                                        {secAxisDependentStations &&
                                        secAxisDependentStations.length > 0
                                            ? secAxisDependentStations.join(
                                                  ', ',
                                              )
                                            : '-'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

ForecastingSummary.propTypes = {
    forecastingSummary: ForecastingSummaryShape,
    showProcessingBar: PropTypes.bool.isRequired,
    showSecondaryAxis: PropTypes.bool.isRequired,
};

ForecastingSummary.defaultProps = {
    forecastingSummary: null,
};
