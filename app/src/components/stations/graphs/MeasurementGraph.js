import React from 'react';
import PropTypes from 'prop-types';

import { EflowsShape, BioperiodBoundaryShape } from 'utils/types';
import { gettext, getTimeSeriesNameByAbbreviation } from 'utils/text';
import { downloadAsExcelComplianceGraph } from 'utils/export/data_to_excel';
import { downloadAsPNG } from 'utils/export/graph_png';

import { EmptyState } from '../shared/EmptyState';
import { ComplianceGraph } from '../shared/ComplianceGraph';
import { ExportDropdown } from '../shared/ExportDropdown';
import { ProcessingState } from '../shared/ProcessingState';
import { VisualizationBlock } from '../shared/VisualizationBlock';

export const MeasurementGraph = ({
    eflows,
    bioperiodsBoundaries,
    secondAxisThreshold,
    secondAxisMeasurementType,
    eflowMeasurementType,
    showSecondaryAxis,
    secondAxisTimeSeriesType,
    showProcessingBar,
    stationName,
    startDate,
    endDate,
    onSetEflowMeasurementType,
    onSetSecondAxisMeasurementType,
    setShowSecondaryAxis,
}) => (
    <>
        <div className="graph-container w-100">
            <div className="w-100 d-flex align-items-center justify-content-between">
                <h4>
                    {gettext(
                        `Environmental flows${
                            showSecondaryAxis
                                ? ` and
                        ${getTimeSeriesNameByAbbreviation(
                            secondAxisTimeSeriesType,
                        ).toLowerCase()}s`
                                : ''
                        }:`,
                    )}
                </h4>
                <ExportDropdown
                    disabled={showProcessingBar || eflows.length === 0}
                    onDownloadExcel={() =>
                        downloadAsExcelComplianceGraph(
                            eflows,
                            eflowMeasurementType,
                            secondAxisTimeSeriesType,
                            secondAxisMeasurementType,
                            secondAxisThreshold,
                            stationName,
                            startDate,
                            endDate,
                            showSecondaryAxis,
                        )
                    }
                    onDownloadImage={() =>
                        downloadAsPNG(
                            'compliance',
                            stationName,
                            startDate,
                            endDate,
                        )
                    }
                />
            </div>
            {showProcessingBar && <ProcessingState />}
            {!showProcessingBar && eflows.length === 0 && <EmptyState />}
            {!showProcessingBar && eflows.length !== 0 && (
                <div className="d-flex flex-row justify-content-between">
                    <VisualizationBlock
                        eflowMeasurementType={eflowMeasurementType}
                        onSetEflowMeasurementType={onSetEflowMeasurementType}
                        secondAxisMeasurementType={secondAxisMeasurementType}
                        onSetSecondAxisMeasurementType={
                            onSetSecondAxisMeasurementType
                        }
                        secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                        showSecondaryAxis={showSecondaryAxis}
                        setShowSecondaryAxis={setShowSecondaryAxis}
                    />
                    <ComplianceGraph
                        eflows={eflows}
                        bioperiodsBoundaries={bioperiodsBoundaries}
                        secondAxisThreshold={secondAxisThreshold}
                        secondAxisMeasurementType={secondAxisMeasurementType}
                        eflowMeasurementType={eflowMeasurementType}
                        showSecondaryAxis={showSecondaryAxis}
                        secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                        stationName={stationName}
                        startDate={startDate}
                        endDate={endDate}
                    />
                </div>
            )}
        </div>
    </>
);

MeasurementGraph.propTypes = {
    eflows: PropTypes.arrayOf(EflowsShape),
    bioperiodsBoundaries: PropTypes.arrayOf(BioperiodBoundaryShape),
    secondAxisThreshold: PropTypes.number.isRequired,
    secondAxisMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    eflowMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    secondAxisTimeSeriesType: PropTypes.oneOf(['WL', 'TW']).isRequired,
    showSecondaryAxis: PropTypes.bool.isRequired,
    stationName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    showProcessingBar: PropTypes.bool.isRequired,
    onSetEflowMeasurementType: PropTypes.func.isRequired,
    onSetSecondAxisMeasurementType: PropTypes.func.isRequired,
    setShowSecondaryAxis: PropTypes.func.isRequired,
};

MeasurementGraph.defaultProps = {
    eflows: [],
    bioperiodsBoundaries: [],
};
