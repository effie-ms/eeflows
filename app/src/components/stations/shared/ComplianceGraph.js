import React from 'react';
import PropTypes from 'prop-types';

import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from 'recharts';

import { EflowsShape, BioperiodBoundaryShape } from 'utils/types';
import {
    gettext,
    getTimeSeriesNameByAbbreviation,
    getTimeSeriesUnitsByAbbreviation,
    getBioperiodBoundaryShortName,
} from 'utils/text';
import {
    SVGElementCircle,
    SVGElementLine,
    SVGElementThresholdType,
    SVGElementTimeSeriesType,
} from './SVGElements';

import { CustomComplianceTooltip } from './CustomComplianceTooltip';
import { CustomizedDot } from './CustomizedDot';

const renderComplianceGraphLegend = (
    showSecondaryAxis,
    secondAxisTimeSeriesType,
) => (
    <div className="mt-3">
        <ul className="recharts-default-legend recharts-default-legend-compliance">
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <SVGElementTimeSeriesType fill="#137cbd" stroke="#137cbd" />
                <span className="recharts-legend-item-text">
                    {gettext('Discharge')}
                </span>
            </li>
            {showSecondaryAxis && (
                <li className="recharts-legend-item recharts-legend-item-compliance">
                    <SVGElementTimeSeriesType
                        fill="none"
                        stroke={
                            secondAxisTimeSeriesType === 'TW'
                                ? '#ff8000'
                                : '#e83e8c'
                        }
                    />
                    <span className="recharts-legend-item-text">
                        {gettext(
                            getTimeSeriesNameByAbbreviation(
                                secondAxisTimeSeriesType,
                            ),
                        )}
                    </span>
                </li>
            )}
        </ul>
        <ul className="recharts-default-legend recharts-default-legend-compliance">
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <SVGElementThresholdType stroke="#137cbd" />
                <span className="recharts-legend-item-text">
                    {gettext('Environmental flow threshold')}
                </span>
            </li>
            {showSecondaryAxis && (
                <li className="recharts-legend-item recharts-legend-item-compliance">
                    <SVGElementThresholdType
                        stroke={
                            secondAxisTimeSeriesType === 'TW'
                                ? '#ff8000'
                                : '#e83e8c'
                        }
                    />
                    <span className="recharts-legend-item-text">
                        {gettext(
                            `${getTimeSeriesNameByAbbreviation(
                                secondAxisTimeSeriesType,
                            )} threshold`,
                        )}
                    </span>
                </li>
            )}
        </ul>
        <ul className="recharts-default-legend recharts-default-legend-compliance">
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <SVGElementCircle fill="green" />
                <span className="recharts-legend-item-text">
                    {gettext('Compliant')}
                </span>
            </li>
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <SVGElementCircle fill="red" />
                <span className="recharts-legend-item-text">
                    {gettext('Non-compliant')}
                </span>
            </li>
        </ul>
        <ul className="recharts-default-legend recharts-default-legend-compliance">
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <SVGElementLine stroke="purple" />
                <span className="recharts-legend-item-text">
                    {gettext('Bioperiod boundaries')}
                </span>
            </li>
        </ul>
        <ul className="recharts-default-legend recharts-default-legend-compliance">
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <span className="recharts-legend-item-text">
                    {gettext(`OW - Overwintering,`)}
                </span>
            </li>
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <span className="recharts-legend-item-text">
                    {gettext(`SS - Spring Spawning,`)}
                </span>
            </li>
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <span className="recharts-legend-item-text">
                    {gettext(`RG - Rearing and Growth,`)}
                </span>
            </li>
            <li className="recharts-legend-item recharts-legend-item-compliance">
                <span className="recharts-legend-item-text">
                    {gettext(`FS - Fall Spawning`)}
                </span>
            </li>
        </ul>
    </div>
);

export const ComplianceGraph = ({
    bioperiodsBoundaries,
    eflows,
    secondAxisThreshold,
    eflowMeasurementType,
    secondAxisMeasurementType,
    showSecondaryAxis,
    secondAxisTimeSeriesType,
    stationName,
    startDate,
    endDate,
}) => (
    <div id="compliance-graph" className="w-100 mt-3">
        <p style={{ textAlign: 'center', fontSize: '18px' }}>
            {gettext(`${stationName}:
        ${gettext(
            `Environmental flows${
                showSecondaryAxis
                    ? ` and
                ${getTimeSeriesNameByAbbreviation(
                    secondAxisTimeSeriesType,
                ).toLowerCase()}s`
                    : ''
            }`,
        )} (${startDate}-${endDate})`)}
        </p>
        <ResponsiveContainer
            width="100%"
            height={850}
            padding={{ left: 0, right: 0 }}
        >
            <ComposedChart
                data={eflows}
                margin={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis
                    dataKey="date"
                    label={{ value: 'Date', offset: 0, position: 'bottom' }}
                    padding={{ left: 0, right: 0 }}
                    scale="point"
                />
                <YAxis
                    yAxisId="left"
                    label={{
                        value: 'Discharge, environmental flow',
                        angle: -90,
                        offset: 0,
                        position: 'insideLeft',
                    }}
                    unit={getTimeSeriesUnitsByAbbreviation('EF')}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                        value: `${
                            showSecondaryAxis
                                ? getTimeSeriesNameByAbbreviation(
                                      secondAxisTimeSeriesType,
                                  )
                                : ''
                        }`,
                        angle: 90,
                        offset: 0,
                        position: 'insideRight',
                    }}
                    unit={getTimeSeriesUnitsByAbbreviation(
                        secondAxisTimeSeriesType,
                    )}
                />
                {eflowMeasurementType === 'all' && (
                    <Area
                        type="monotone"
                        yAxisId="left"
                        dataKey="discharge_range"
                        fill="#48aff0"
                        stroke="#137cbd"
                        connectNulls
                    />
                )}
                {eflowMeasurementType === 'all' && (
                    <Area
                        type="monotone"
                        yAxisId="left"
                        dataKey="low_eflows_level_range"
                        fill="#3dcc91"
                        stroke="#137cbd"
                        connectNulls
                    />
                )}
                {secondAxisMeasurementType === 'all' && showSecondaryAxis && (
                    <Area
                        type="monotone"
                        yAxisId="right"
                        dataKey="second_axis_ts_range"
                        fill={
                            secondAxisTimeSeriesType === 'TW'
                                ? '#ffb366'
                                : '#C465B2'
                        }
                        stroke={
                            secondAxisTimeSeriesType === 'TW'
                                ? '#ff8000'
                                : '#e83e8c'
                        }
                        connectNulls
                    />
                )}
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomComplianceTooltip />} />
                <Legend
                    content={() =>
                        renderComplianceGraphLegend(
                            showSecondaryAxis,
                            secondAxisTimeSeriesType,
                        )
                    }
                />
                {bioperiodsBoundaries.length > 0 &&
                    bioperiodsBoundaries.map((bound) => (
                        <ReferenceLine
                            key={`rf-${bound.date}`}
                            xAxisId={0}
                            yAxisId="right"
                            x={bound.date}
                            stroke="purple"
                            strokeWidth={3}
                            label={{
                                position: 'top',
                                value: getBioperiodBoundaryShortName(
                                    bound.label,
                                ),
                            }}
                        />
                    ))}
                {(eflowMeasurementType === 'all' ||
                    eflowMeasurementType === 'min') && (
                    <Line
                        id="min-eflow"
                        yAxisId="left"
                        type="monotone"
                        name="Minimum discharge"
                        dataKey="min_discharge"
                        stroke="#137cbd"
                        strokeWidth={3}
                        connectNulls
                        dot={(coord) => (
                            <CustomizedDot
                                key={`min-eflow-${coord.key}`}
                                coord={coord}
                                measurementType="min"
                                timeSeriesType="EF"
                            />
                        )}
                        unit={getTimeSeriesUnitsByAbbreviation('EF')}
                    />
                )}
                {(eflowMeasurementType === 'all' ||
                    eflowMeasurementType === 'avg') && (
                    <Line
                        id="avg-eflow"
                        yAxisId="left"
                        type="monotone"
                        name="Average discharge"
                        dataKey="avg_discharge"
                        stroke="#137cbd"
                        strokeWidth={3}
                        connectNulls
                        dot={(coord) => (
                            <CustomizedDot
                                key={`avg-eflow-${coord.key}`}
                                coord={coord}
                                measurementType="avg"
                                timeSeriesType="EF"
                            />
                        )}
                        unit={getTimeSeriesUnitsByAbbreviation('EF')}
                    />
                )}
                {(eflowMeasurementType === 'all' ||
                    eflowMeasurementType === 'max') && (
                    <Line
                        id="max-eflow"
                        yAxisId="left"
                        type="monotone"
                        name="Maximum discharge"
                        dataKey="max_discharge"
                        stroke="#137cbd"
                        strokeWidth={3}
                        connectNulls
                        dot={(coord) => (
                            <CustomizedDot
                                key={`max-eflow-${coord.key}`}
                                coord={coord}
                                measurementType="max"
                                timeSeriesType="EF"
                            />
                        )}
                        unit={getTimeSeriesUnitsByAbbreviation('EF')}
                    />
                )}
                {showSecondaryAxis &&
                    (secondAxisMeasurementType === 'all' ||
                        secondAxisMeasurementType === 'min') && (
                        <Line
                            id="min-sec-axis"
                            yAxisId="right"
                            type="monotone"
                            name={`Minimum ${getTimeSeriesNameByAbbreviation(
                                secondAxisTimeSeriesType,
                            ).toLowerCase()}`}
                            dataKey="min_second_axis_ts"
                            stroke={
                                secondAxisTimeSeriesType === 'TW'
                                    ? '#ff8000'
                                    : '#e83e8c'
                            }
                            connectNulls
                            strokeWidth={3}
                            dot={(coord) => (
                                <CustomizedDot
                                    key={`min-sec-axis-${coord.key}`}
                                    coord={coord}
                                    measurementType="min"
                                    timeSeriesType={secondAxisTimeSeriesType}
                                    thresholdValue={secondAxisThreshold}
                                />
                            )}
                            unit={getTimeSeriesUnitsByAbbreviation(
                                secondAxisTimeSeriesType,
                            )}
                        />
                    )}
                {showSecondaryAxis &&
                    (secondAxisMeasurementType === 'all' ||
                        secondAxisMeasurementType === 'avg') && (
                        <Line
                            id="avg-sec-axis"
                            yAxisId="right"
                            type="monotone"
                            name={`Average ${getTimeSeriesNameByAbbreviation(
                                secondAxisTimeSeriesType,
                            ).toLowerCase()}`}
                            dataKey="avg_second_axis_ts"
                            stroke={
                                secondAxisTimeSeriesType === 'TW'
                                    ? '#ff8000'
                                    : '#e83e8c'
                            }
                            connectNulls
                            strokeWidth={3}
                            dot={(coord) => (
                                <CustomizedDot
                                    key={`avg-sec-axis-${coord.key}`}
                                    coord={coord}
                                    measurementType="avg"
                                    timeSeriesType={secondAxisTimeSeriesType}
                                    thresholdValue={secondAxisThreshold}
                                />
                            )}
                            unit={getTimeSeriesUnitsByAbbreviation(
                                secondAxisTimeSeriesType,
                            )}
                        />
                    )}
                {showSecondaryAxis &&
                    (secondAxisMeasurementType === 'all' ||
                        secondAxisMeasurementType === 'max') && (
                        <Line
                            id="max-sec-axis"
                            yAxisId="right"
                            type="monotone"
                            name={`Maximum ${getTimeSeriesNameByAbbreviation(
                                secondAxisTimeSeriesType,
                            ).toLowerCase()}`}
                            dataKey="max_second_axis_ts"
                            stroke={
                                secondAxisTimeSeriesType === 'TW'
                                    ? '#ff8000'
                                    : '#e83e8c'
                            }
                            connectNulls
                            strokeWidth={3}
                            dot={(coord) => (
                                <CustomizedDot
                                    key={`max-sec-axis-${coord.key}`}
                                    coord={coord}
                                    measurementType="max"
                                    timeSeriesType={secondAxisTimeSeriesType}
                                    thresholdValue={secondAxisThreshold}
                                />
                            )}
                            unit={getTimeSeriesUnitsByAbbreviation(
                                secondAxisTimeSeriesType,
                            )}
                        />
                    )}
                {showSecondaryAxis && (
                    <ReferenceLine
                        y={secondAxisThreshold}
                        yAxisId="right"
                        id="sec-axis-threshold"
                        label=""
                        stroke={
                            secondAxisTimeSeriesType === 'TW'
                                ? '#ff8000'
                                : '#e83e8c'
                        }
                        strokeWidth={3}
                        strokeDasharray="5 5"
                    />
                )}
                {(eflowMeasurementType === 'all' ||
                    eflowMeasurementType === 'min') && (
                    <Line
                        id="min-eflow-level"
                        yAxisId="left"
                        type="stepAfter"
                        dot={false}
                        connectNulls
                        name="Minimum environmental flow threshold"
                        dataKey="min_low_eflow_level"
                        stroke="#137cbd"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        unit={getTimeSeriesUnitsByAbbreviation('EF')}
                    />
                )}
                {(eflowMeasurementType === 'all' ||
                    eflowMeasurementType === 'avg') && (
                    <Line
                        id="avg-eflow-level"
                        yAxisId="left"
                        type="stepAfter"
                        dot={false}
                        connectNulls
                        name="Average environmental flow threshold"
                        dataKey="avg_low_eflow_level"
                        stroke="#137cbd"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        unit={getTimeSeriesUnitsByAbbreviation('EF')}
                    />
                )}
                {(eflowMeasurementType === 'all' ||
                    eflowMeasurementType === 'max') && (
                    <Line
                        id="max-eflow-level"
                        yAxisId="left"
                        type="stepAfter"
                        dot={false}
                        connectNulls
                        name="Maximum environmental flow threshold"
                        dataKey="max_low_eflow_level"
                        stroke="#137cbd"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        unit={getTimeSeriesUnitsByAbbreviation('EF')}
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

ComplianceGraph.propTypes = {
    eflows: PropTypes.arrayOf(EflowsShape).isRequired,
    bioperiodsBoundaries: PropTypes.arrayOf(BioperiodBoundaryShape),
    secondAxisThreshold: PropTypes.number.isRequired,
    eflowMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    secondAxisMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    showSecondaryAxis: PropTypes.bool.isRequired,
    secondAxisTimeSeriesType: PropTypes.oneOf(['WL', 'TW']).isRequired,
    stationName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
};

ComplianceGraph.defaultProps = {
    bioperiodsBoundaries: [],
};
