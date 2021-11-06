import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { BioperiodBoundaryShape, EflowsShape } from 'utils/types';

import { MeasurementGraph } from 'components/stations/graphs/MeasurementGraph';
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
    secondAxisMeasurementType,
    secondAxisThreshold,
    bioperiodsBoundaries,
    graphRef,
    onSetEflowMeasurementType,
    onSetSecondAxisMeasurementType,
    setShowSecondaryAxis,
}) => {
    const formattedStartDate = moment(startDate).format('DD.MM.YYYY');
    const formattedEndDate = moment(endDate).format('DD.MM.YYYY');

    return (
        <div className="graphs" ref={graphRef}>
            <MeasurementGraph
                eflows={eflowsTS}
                bioperiodsBoundaries={bioperiodsBoundaries}
                secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                secondAxisThreshold={secondAxisThreshold}
                secondAxisMeasurementType={secondAxisMeasurementType}
                showSecondaryAxis={showSecondaryAxis}
                eflowMeasurementType={eflowMeasurementType}
                showProcessingBar={showProcessingBar}
                stationName={stationName}
                startDate={formattedStartDate}
                endDate={formattedEndDate}
                onSetEflowMeasurementType={onSetEflowMeasurementType}
                onSetSecondAxisMeasurementType={onSetSecondAxisMeasurementType}
                setShowSecondaryAxis={setShowSecondaryAxis}
            />
            <div className="d-flex justify-content-between">
                <UCUTPlotEflows
                    eflowsTS={eflowsTS}
                    stationName={stationName}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
                    showProcessingBar={showProcessingBar}
                />
                <ComplianceTableEflows
                    eflowsTS={eflowsTS}
                    stationName={stationName}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
                    showProcessingBar={showProcessingBar}
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
                    showProcessingBar={showProcessingBar}
                />
                <ComplianceTableSecondAxis
                    eflowsTS={eflowsTS}
                    threshold={secondAxisThreshold}
                    stationName={stationName}
                    secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                    startDate={formattedStartDate}
                    endDate={formattedEndDate}
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
    bioperiodsBoundaries: PropTypes.arrayOf(BioperiodBoundaryShape),
    secondAxisThreshold: PropTypes.number.isRequired,
    secondAxisMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    eflowMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    graphRef: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onSetEflowMeasurementType: PropTypes.func.isRequired,
    onSetSecondAxisMeasurementType: PropTypes.func.isRequired,
    setShowSecondaryAxis: PropTypes.func.isRequired,
};

Graphs.defaultProps = {
    eflowsTS: [],
    startDate: null,
    endDate: null,
    bioperiodsBoundaries: [],
    graphRef: null,
};
