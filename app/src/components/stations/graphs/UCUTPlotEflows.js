import React from 'react';
import PropTypes from 'prop-types';

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

import { gettext, getTimeSeriesNameByAbbreviation } from 'utils/text';
import { EflowsShape } from 'utils/types';
import { downloadAsPNG } from 'utils/export/graph_png';
import { downloadAsExcelUCUT } from 'utils/export/data_to_excel';
import { getCumulativeDurationsEflows } from 'utils/UCUT';

import { ExportDropdown } from 'components/stations/shared/ExportDropdown';
import { ProcessingState } from 'components/stations/shared/ProcessingState';

export const UCUTPlotEflows = ({
    eflowsTS,
    stationName,
    startDate,
    endDate,
    forecastingEnabled,
    showProcessingBar,
}) => {
    const UCUTLowObserved = getCumulativeDurationsEflows(
        eflowsTS,
        'LOW',
        false,
    );
    const UCUTLowForecast = getCumulativeDurationsEflows(eflowsTS, 'LOW', true);
    const UCUTBaseObserved = getCumulativeDurationsEflows(
        eflowsTS,
        'BASE',
        false,
    );
    const UCUTBaseForecast = getCumulativeDurationsEflows(
        eflowsTS,
        'BASE',
        true,
    );
    const UCUTSubsistenceObserved = getCumulativeDurationsEflows(
        eflowsTS,
        'SUBSISTENCE',
        false,
    );
    const UCUTSubsistenceForecast = getCumulativeDurationsEflows(
        eflowsTS,
        'SUBSISTENCE',
        true,
    );
    const UCUTCriticalObserved = getCumulativeDurationsEflows(
        eflowsTS,
        'CRITICAL',
        false,
    );
    const UCUTCriticalForecast = getCumulativeDurationsEflows(
        eflowsTS,
        'CRITICAL',
        true,
    );

    const exportData = {
        UCUTLowObserved,
        UCUTLowForecast,
        UCUTBaseObserved,
        UCUTBaseForecast,
        UCUTSubsistenceObserved,
        UCUTSubsistenceForecast,
        UCUTCriticalObserved,
        UCUTCriticalForecast,
    };

    const graphName = gettext(
        `Uniform Continuous Under-Threshold Graph: ${getTimeSeriesNameByAbbreviation(
            'EF',
        )}`,
    );

    return (
        <div
            className="graph-container"
            style={{
                flexBasis: '50%',
                minWidth: '750px',
                paddingRight: '50px',
            }}
        >
            <div className="d-flex align-items-center justify-content-between">
                <h4>
                    {gettext(
                        `Uniform Continuous Under-Threshold Graph:
                    ${getTimeSeriesNameByAbbreviation('EF')}`,
                    )}
                </h4>
                <ExportDropdown
                    disabled={showProcessingBar}
                    onDownloadExcel={() =>
                        downloadAsExcelUCUT(
                            exportData,
                            'EF',
                            forecastingEnabled,
                            stationName,
                            startDate,
                            endDate,
                        )
                    }
                    onDownloadImage={() =>
                        downloadAsPNG(
                            'UCUT-EF',
                            stationName,
                            startDate,
                            endDate,
                        )
                    }
                />
            </div>
            {showProcessingBar ? (
                <ProcessingState />
            ) : (
                <div id="ucut-eflows" className="w-100">
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>
                        {gettext(
                            `${stationName}: ${graphName} (${startDate}-${endDate})`,
                        )}
                    </p>
                    <ResponsiveContainer height={400}>
                        <ScatterChart
                            margin={{
                                top: 20,
                                right: 80,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <Legend />
                            <XAxis
                                type="number"
                                dataKey="cumulativeDuration"
                                name="Cumulative duration"
                                unit="%"
                                domain={[0, 100]}
                                label={{
                                    value: `${gettext('Cumulative duration')}`,
                                    offset: 0,
                                    position: 'bottom',
                                }}
                            />
                            <YAxis
                                type="number"
                                dataKey="daysDuration"
                                name="Duration of days"
                                unit="d"
                                label={{
                                    value: `${gettext('Duration of days')}`,
                                    angle: -90,
                                    offset: 0,
                                    position: 'insideLeft',
                                }}
                            />
                            <ZAxis type="number" range={[30]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter
                                name={`${gettext('Low flow')}`}
                                data={UCUTLowObserved}
                                fill="#000000"
                                line={{ type: 'monotone', strokeWidth: 3 }}
                            />
                            <Scatter
                                name={`${gettext('Base environmental flow')}`}
                                data={UCUTBaseObserved}
                                fill="#0a6640"
                                line={{ type: 'monotone', strokeWidth: 3 }}
                            />
                            <Scatter
                                name={`${gettext(
                                    'Critical environmental flow',
                                )}`}
                                data={UCUTCriticalObserved}
                                fill="#a82a2a"
                                line={{ type: 'monotone', strokeWidth: 3 }}
                            />
                            <Scatter
                                name={`${gettext(
                                    'Subsistence environmental flow',
                                )}`}
                                data={UCUTSubsistenceObserved}
                                fill="#5642a6"
                                line={{ type: 'monotone', strokeWidth: 3 }}
                            />
                            {forecastingEnabled && (
                                <Scatter
                                    name={`${gettext('Low flow: forecast')}`}
                                    data={UCUTLowForecast}
                                    fill="#000000"
                                    line={{
                                        type: 'monotone',
                                        strokeWidth: 3,
                                        strokeDasharray: '5 5',
                                    }}
                                />
                            )}
                            {forecastingEnabled && (
                                <Scatter
                                    name={`${gettext(
                                        'Base environmental flow: forecast',
                                    )}`}
                                    data={UCUTBaseForecast}
                                    fill="#0a6640"
                                    line={{
                                        type: 'monotone',
                                        strokeWidth: 3,
                                        strokeDasharray: '5 5',
                                    }}
                                />
                            )}
                            {forecastingEnabled && (
                                <Scatter
                                    name={`${gettext(
                                        'Critical environmental flow: forecast',
                                    )}`}
                                    data={UCUTCriticalForecast}
                                    fill="#a82a2a"
                                    line={{
                                        type: 'monotone',
                                        strokeWidth: 3,
                                        strokeDasharray: '5 5',
                                    }}
                                />
                            )}
                            {forecastingEnabled && (
                                <Scatter
                                    name={`${gettext(
                                        'Subsistence environmental flow: forecast',
                                    )}`}
                                    data={UCUTSubsistenceForecast}
                                    fill="#5642a6"
                                    line={{
                                        type: 'monotone',
                                        strokeWidth: 3,
                                        strokeDasharray: '5 5',
                                    }}
                                />
                            )}
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

UCUTPlotEflows.propTypes = {
    eflowsTS: PropTypes.arrayOf(EflowsShape),
    stationName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    forecastingEnabled: PropTypes.bool.isRequired,
    showProcessingBar: PropTypes.bool.isRequired,
};

UCUTPlotEflows.defaultProps = {
    eflowsTS: [],
};
