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
            />
            <ForecastingSummary
                forecastingSummary={forecastingSummary}
                showProcessingBar={showProcessingBar}
                showSecondaryAxis={showSecondaryAxis}
            />
            <div className="d-flex justify-content-between">
                <UCUTPlotEflows
                    eflowsTS={eflowsTS}
                    stationName={stationName}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
                    forecastingEnabled={showFullForecastDischarge}
                    showProcessingBar={showProcessingBar}
                />
                <ComplianceTableEflows
                    eflowsTS={eflowsTS}
                    stationName={stationName}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
                    forecastingEnabled={showFullForecastDischarge}
                    showProcessingBar={showProcessingBar}
                />
            </div>
            {showSecondaryAxis && (
                <div className="d-flex justify-content-between">
                    <UCUTPlotSecondAxis
                        eflowsTS={eflowsTS}
                        threshold={secondAxisThreshold}
                        secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                        stationName={stationName}
                        startDate={formattedStartDate}
                        endDate={formattedEndDate}
                        forecastingEnabled={showFullForecastSecondAxis}
                        showProcessingBar={showProcessingBar}
                    />
                    <ComplianceTableSecondAxis
                        eflowsTS={eflowsTS}
                        threshold={secondAxisThreshold}
                        stationName={stationName}
                        secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                        startDate={formattedStartDate}
                        endDate={formattedEndDate}
                        forecastingEnabled={showFullForecastSecondAxis}
                        showProcessingBar={showProcessingBar}
                    />
                </div>
            )}
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
};

Graphs.defaultProps = {
    eflowsTS: [],
    startDate: null,
    endDate: null,
    bioperiodsBoundaries: [],
    forecastingSummary: null,
    graphRef: null,
};
