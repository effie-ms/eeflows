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

export const MeasurementGraph = ({
    eflows,
    bioperiodsBoundaries,
    secondAxisThreshold,
    secondAxisMeasurementType,
    eflowMeasurementType,
    showSecondaryAxis,
    secondAxisTimeSeriesType,
    eflowThreshold,
    factored,
    showProcessingBar,
    stationName,
    startDate,
    endDate,
    showFullForecastDischarge,
    showFullForecastSecondAxis,
}) => (
    <>
        <div className="graph-container">
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
                            eflowThreshold,
                            secondAxisTimeSeriesType,
                            secondAxisMeasurementType,
                            secondAxisThreshold,
                            factored,
                            stationName,
                            startDate,
                            endDate,
                            showFullForecastDischarge,
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
                <ComplianceGraph
                    eflows={eflows}
                    bioperiodsBoundaries={bioperiodsBoundaries}
                    secondAxisThreshold={secondAxisThreshold}
                    secondAxisMeasurementType={secondAxisMeasurementType}
                    eflowMeasurementType={eflowMeasurementType}
                    showSecondaryAxis={showSecondaryAxis}
                    secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                    factored={factored}
                    stationName={stationName}
                    startDate={startDate}
                    endDate={endDate}
                    eflowType={eflowThreshold}
                    showFullForecastDischarge={showFullForecastDischarge}
                    showFullForecastSecondAxis={showFullForecastSecondAxis}
                />
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
    factored: PropTypes.bool.isRequired,
    stationName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    showProcessingBar: PropTypes.bool.isRequired,
    eflowThreshold: PropTypes.oneOf(['low', 'base', 'critical', 'subsistence'])
        .isRequired,
    showFullForecastDischarge: PropTypes.bool.isRequired,
    showFullForecastSecondAxis: PropTypes.bool.isRequired,
};

MeasurementGraph.defaultProps = {
    eflows: [],
    bioperiodsBoundaries: [],
};
