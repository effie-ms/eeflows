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
import { downloadAsExcelUCUT } from 'utils/export/data_to_excel';
import { downloadAsPNG } from 'utils/export/graph_png';
import { getCumulativeDurationsSecondaryAxisTS } from 'utils/UCUT';

import { ExportDropdown } from 'components/stations/shared/ExportDropdown';
import { ProcessingState } from 'components/stations/shared/ProcessingState';

export const UCUTPlotSecondAxis = ({
    eflowsTS,
    threshold,
    secondAxisTimeSeriesType,
    stationName,
    startDate,
    endDate,
    showProcessingBar,
}) => {
    const graphType = secondAxisTimeSeriesType === 'TW' ? 'Above' : 'Under';

    const UCUTObserved = getCumulativeDurationsSecondaryAxisTS(
        eflowsTS,
        threshold,
        graphType === 'Under',
    );

    const exportData = { UCUTObserved };

    const graphName = gettext(
        `Uniform Continuous ${graphType}-Threshold Graph: ${getTimeSeriesNameByAbbreviation(
            secondAxisTimeSeriesType,
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
                <h4>{graphName}</h4>
                <ExportDropdown
                    disabled={showProcessingBar}
                    onDownloadExcel={() =>
                        downloadAsExcelUCUT(
                            exportData,
                            secondAxisTimeSeriesType,
                            stationName,
                            startDate,
                            endDate,
                        )
                    }
                    onDownloadImage={() =>
                        downloadAsPNG(
                            `UCUT-${secondAxisTimeSeriesType}`,
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
                <div id="ucut-second-axis" className="w-100">
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
                            <Legend style={{ paddingLeft: 60 }} />
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
                                name="Duration (days)"
                                unit="d"
                                label={{
                                    value: `${gettext('Duration (days)')}`,
                                    angle: -90,
                                    offset: 0,
                                    position: 'insideLeft',
                                }}
                            />
                            <ZAxis type="number" range={[30]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter
                                name={`${getTimeSeriesNameByAbbreviation(
                                    secondAxisTimeSeriesType,
                                )}`}
                                data={UCUTObserved}
                                fill={
                                    secondAxisTimeSeriesType === 'TW'
                                        ? '#ff8000'
                                        : '#e83e8c'
                                }
                                line={{ type: 'monotone', strokeWidth: 3 }}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

UCUTPlotSecondAxis.propTypes = {
    eflowsTS: PropTypes.arrayOf(EflowsShape),
    threshold: PropTypes.number.isRequired,
    secondAxisTimeSeriesType: PropTypes.oneOf(['TW', 'WL']).isRequired,
    stationName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    showProcessingBar: PropTypes.bool.isRequired,
};

UCUTPlotSecondAxis.defaultProps = {
    eflowsTS: [],
};
