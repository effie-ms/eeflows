import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import {
    BioperiodBoundaryShape,
    EflowsShape,
    ForecastingSummaryShape,
} from 'utils/types';

import { MeasurementGraph } from 'components/stations/graphs/MeasurementGraph';
import { ForecastingSummary } from 'components/stations/graphs/ForecastingSummary';
import { UCUTPlotEflows } from 'components/stations/graphs/UCUTPlotEflows';
import { ComplianceTableEflows } from 'components/stations/graphs/ComplianceTableEflows';
import { UCUTPlotSecondAxis } from 'components/stations/graphs/UCUTPlotSecondAxis';
import { ComplianceTableSecondAxis } from 'components/stations/graphs/ComplianceTableSecondAxis';

export const Graphs = ({
    stationName,
    startDate,
    endDate,
    showSecondaryAxis,
    secondAxisTimeSeriesType,
    showProcessingBar,
    eflowsTS,
    eflowMeasurementType,
    eflowThreshold,
    secondAxisMeasurementType,
    secondAxisThreshold,
    areaFactor,
    bioperiodsBoundaries,
    showFullForecastDischarge,
    showFullForecastSecondAxis,
    forecastingSummary,
    graphRef,
    onSetEflowThreshold,
    onSetEflowMeasurementType,
    onSetSecondAxisMeasurementType,
    setShowSecondaryAxis,
    setShowFullForecastDischarge,
    setShowFullForecastSecondAxis,
    enableForecasting,
    meanLowFlowMethod,
}) => {
    const formattedStartDate = moment(startDate).format('DD.MM.YYYY');
    const formattedEndDate = moment(endDate).format('DD.MM.YYYY');

    return (
        <div className="graphs" ref={graphRef}>
            <MeasurementGraph
                eflows={eflowsTS}
                factored={areaFactor !== 0}
                bioperiodsBoundaries={bioperiodsBoundaries}
                secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                secondAxisThreshold={secondAxisThreshold}
                secondAxisMeasurementType={secondAxisMeasurementType}
                showSecondaryAxis={showSecondaryAxis}
                eflowMeasurementType={eflowMeasurementType}
                eflowThreshold={eflowThreshold}
                showProcessingBar={showProcessingBar}
                stationName={stationName}
                startDate={formattedStartDate}
                endDate={formattedEndDate}
                showFullForecastDischarge={showFullForecastDischarge}
                showFullForecastSecondAxis={showFullForecastSecondAxis}
                onSetEflowMeasurementType={onSetEflowMeasurementType}
                onSetSecondAxisMeasurementType={onSetSecondAxisMeasurementType}
                setShowSecondaryAxis={setShowSecondaryAxis}
                onSetEflowThreshold={onSetEflowThreshold}
                setShowFullForecastDischarge={setShowFullForecastDischarge}
                setShowFullForecastSecondAxis={setShowFullForecastSecondAxis}
                enableForecasting={enableForecasting}
                meanLowFlowMethod={meanLowFlowMethod}
            />
            {enableForecasting && (
                <ForecastingSummary
                    forecastingSummary={forecastingSummary}
                    showProcessingBar={showProcessingBar}
                    showSecondaryAxis={showSecondaryAxis}
                />
            )}
            <div className="d-flex justify-content-between">
                <UCUTPlotEflows
                    eflowsTS={eflowsTS}
                    stationName={stationName}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
                    enableForecasting={enableForecasting}
                    showProcessingBar={showProcessingBar}
                    meanLowFlowMethod={meanLowFlowMethod}
                />
                <ComplianceTableEflows
                    eflowsTS={eflowsTS}
                    stationName={stationName}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
                    enableForecasting={enableForecasting}
                    showProcessingBar={showProcessingBar}
                    meanLowFlowMethod={meanLowFlowMethod}
                />
            </div>
            <div className="d-flex justify-content-between">
                <UCUTPlotSecondAxis
                    eflowsTS={eflowsTS}
                    threshold={secondAxisThreshold}
                    secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                    stationName={stationName}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
                    enableForecasting={enableForecasting}
                    showProcessingBar={showProcessingBar}
                />
                <ComplianceTableSecondAxis
                    eflowsTS={eflowsTS}
                    threshold={secondAxisThreshold}
                    stationName={stationName}
                    secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
                    enableForecasting={enableForecasting}
                    showProcessingBar={showProcessingBar}
                />
            </div>
        </div>
    );
};

Graphs.propTypes = {
    eflowsTS: PropTypes.arrayOf(EflowsShape),
    stationName: PropTypes.string.isRequired,
    secondAxisTimeSeriesType: PropTypes.oneOf(['WL', 'TW']).isRequired,
    showSecondaryAxis: PropTypes.bool.isRequired,
    showProcessingBar: PropTypes.bool.isRequired,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    areaFactor: PropTypes.number.isRequired,
    bioperiodsBoundaries: PropTypes.arrayOf(BioperiodBoundaryShape),
    secondAxisThreshold: PropTypes.number.isRequired,
    secondAxisMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    eflowMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    eflowThreshold: PropTypes.oneOf(['low', 'base', 'critical', 'subsistence'])
        .isRequired,
    showFullForecastDischarge: PropTypes.bool.isRequired,
    showFullForecastSecondAxis: PropTypes.bool.isRequired,
    forecastingSummary: ForecastingSummaryShape,
    graphRef: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onSetEflowThreshold: PropTypes.func.isRequired,
    onSetEflowMeasurementType: PropTypes.func.isRequired,
    onSetSecondAxisMeasurementType: PropTypes.func.isRequired,
    setShowSecondaryAxis: PropTypes.func.isRequired,
    setShowFullForecastDischarge: PropTypes.func.isRequired,
    setShowFullForecastSecondAxis: PropTypes.func.isRequired,
    enableForecasting: PropTypes.bool.isRequired,
    meanLowFlowMethod: PropTypes.oneOf([
        'TNT30',
        'TNT20',
        'EXCEED95',
        'EXCEED75',
        'RAELFF',
    ]).isRequired,
};

Graphs.defaultProps = {
    eflowsTS: [],
    startDate: null,
    endDate: null,
    bioperiodsBoundaries: [],
    forecastingSummary: null,
    graphRef: null,
};
