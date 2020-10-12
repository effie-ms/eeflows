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

const getUCUTDataLow = eflowsTS => ({
    UCUTLowObserved: getCumulativeDurationsEflows(eflowsTS, 'LOW', false),
    UCUTLowForecast: getCumulativeDurationsEflows(eflowsTS, 'LOW', true),
});

const getUCUTDataRAELFF = eflowsTS => ({
    UCUTBaseObserved: getCumulativeDurationsEflows(eflowsTS, 'BASE', false),
    UCUTBaseForecast: getCumulativeDurationsEflows(eflowsTS, 'BASE', true),
    UCUTSubsistenceObserved: getCumulativeDurationsEflows(
        eflowsTS,
        'SUBSISTENCE',
        false,
    ),
    UCUTSubsistenceForecast: getCumulativeDurationsEflows(
        eflowsTS,
        'SUBSISTENCE',
        true,
    ),
    UCUTCriticalObserved: getCumulativeDurationsEflows(
        eflowsTS,
        'CRITICAL',
        false,
    ),
    UCUTCriticalForecast: getCumulativeDurationsEflows(
        eflowsTS,
        'CRITICAL',
        true,
    ),
});

export const UCUTPlotEflows = ({
    eflowsTS,
    stationName,
    startDate,
    endDate,
    enableForecasting,
    showProcessingBar,
    meanLowFlowMethod,
}) => {
    const data =
        meanLowFlowMethod !== 'RAELFF'
            ? getUCUTDataLow(eflowsTS)
            : getUCUTDataRAELFF(eflowsTS);

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
                            data,
                            'EF',
                            enableForecasting,
                            stationName,
                            startDate,
                            endDate,
                            meanLowFlowMethod,
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
                            {meanLowFlowMethod !== 'RAELFF' && (
                                <Scatter
                                    name={`${gettext('Low flow')}`}
                                    data={data.UCUTLowObserved}
                                    fill="#000000"
                                    line={{ type: 'monotone', strokeWidth: 3 }}
                                />
                            )}
                            {meanLowFlowMethod !== 'RAELFF' &&
                                enableForecasting && (
                                    <Scatter
                                        name={`${gettext(
                                            'Low flow: forecast',
                                        )}`}
                                        data={data.UCUTLowForecast}
                                        fill="#000000"
                                        line={{
                                            type: 'monotone',
                                            strokeWidth: 3,
                                            strokeDasharray: '5 5',
                                        }}
                                    />
                                )}
                            {meanLowFlowMethod === 'RAELFF' && (
                                <Scatter
                                    name={`${gettext(
                                        'Base environmental flow',
                                    )}`}
                                    data={data.UCUTBaseObserved}
                                    fill="#0a6640"
                                    line={{ type: 'monotone', strokeWidth: 3 }}
                                />
                            )}
                            {meanLowFlowMethod === 'RAELFF' &&
                                enableForecasting && (
                                    <Scatter
                                        name={`${gettext(
                                            'Base environmental flow: forecast',
                                        )}`}
                                        data={data.UCUTBaseForecast}
                                        fill="#0a6640"
                                        line={{
                                            type: 'monotone',
                                            strokeWidth: 3,
                                            strokeDasharray: '5 5',
                                        }}
                                    />
                                )}
                            {meanLowFlowMethod === 'RAELFF' && (
                                <Scatter
                                    name={`${gettext(
                                        'Critical environmental flow',
                                    )}`}
                                    data={data.UCUTCriticalObserved}
                                    fill="#a82a2a"
                                    line={{ type: 'monotone', strokeWidth: 3 }}
                                />
                            )}
                            {meanLowFlowMethod === 'RAELFF' &&
                                enableForecasting && (
                                    <Scatter
                                        name={`${gettext(
                                            'Critical environmental flow: forecast',
                                        )}`}
                                        data={data.UCUTCriticalForecast}
                                        fill="#a82a2a"
                                        line={{
                                            type: 'monotone',
                                            strokeWidth: 3,
                                            strokeDasharray: '5 5',
                                        }}
                                    />
                                )}
                            {meanLowFlowMethod === 'RAELFF' && (
                                <Scatter
                                    name={`${gettext(
                                        'Subsistence environmental flow',
                                    )}`}
                                    data={data.UCUTSubsistenceObserved}
                                    fill="#5642a6"
                                    line={{ type: 'monotone', strokeWidth: 3 }}
                                />
                            )}
                            {meanLowFlowMethod === 'RAELFF' &&
                                enableForecasting && (
                                    <Scatter
                                        name={`${gettext(
                                            'Subsistence environmental flow: forecast',
                                        )}`}
                                        data={data.UCUTSubsistenceForecast}
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
    enableForecasting: PropTypes.bool.isRequired,
    showProcessingBar: PropTypes.bool.isRequired,
    meanLowFlowMethod: PropTypes.oneOf([
        'TNT30',
        'TNT20',
        'EXCEED95',
        'EXCEED75',
        'RAELFF',
    ]).isRequired,
};

UCUTPlotEflows.defaultProps = {
    eflowsTS: [],
};
