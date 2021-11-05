/* eslint-disable no-param-reassign */
import fileDownload from 'js-file-download';
import * as Excel from 'exceljs/dist/exceljs.min.js'; // eslint-disable-line

import {
    createAndFillWorkbookEflowCompliance,
    createAndFillWorkbookSecondAxisCompliance,
} from './compliance_excel';
import {
    createAndFillWorkbookEflowUCUT,
    createAndFillWorkbookSecondAxisUCUT,
} from './ucut_excel';
import {
    createAndFillWorkbookComplianceTableEflows,
    createAndFillWorkbookComplianceTableSecondAxis,
} from './compliance_table_excel';

const EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const triggerDownloadExcel = (workbook, fileName) => {
    if (workbook) {
        // Generate Excel File
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: EXCEL_TYPE });
            // Given name
            fileDownload(blob, `${fileName}.xlsx`);
        });
    }
};

export const downloadAsExcelComplianceGraph = (
    exportData,
    eflowsMeasurementType,
    secondAxisTimeSeriesType,
    secondAxisMeasurementType,
    secondAxisThreshold,
    stationName,
    startDate,
    endDate,
    compoundEventEnabled,
) => {
    const fileName = `${stationName}-compliance-${startDate}-${endDate}`;
    let workbook = new Excel.Workbook();

    workbook = createAndFillWorkbookEflowCompliance(
        exportData,
        eflowsMeasurementType,
        workbook,
    );

    if (compoundEventEnabled) {
        workbook = createAndFillWorkbookSecondAxisCompliance(
            exportData,
            secondAxisMeasurementType,
            secondAxisThreshold,
            secondAxisTimeSeriesType,
            workbook,
        );
    }

    triggerDownloadExcel(workbook, fileName);
};

export const downloadAsExcelUCUT = (
    exportData,
    timeSeriesType,
    stationName,
    startDate,
    endDate,
) => {
    const fileName = `${stationName}-UCUT-${timeSeriesType}-${startDate}-${endDate}`;
    let workbook;

    if (timeSeriesType === 'EF') {
        workbook = createAndFillWorkbookEflowUCUT(
            exportData,
        );
    } else {
        workbook = createAndFillWorkbookSecondAxisUCUT(
            exportData,
            timeSeriesType,
        );
    }

    triggerDownloadExcel(workbook, fileName);
};

export const downloadAsExcelComplianceSummaries = (
    exportData,
    timeSeriesType,
    stationName,
    startDate,
    endDate,
) => {
    const fileName = `${stationName}-CT-${timeSeriesType}-${startDate}-${endDate}`;
    let workbook;

    if (timeSeriesType === 'EF') {
        workbook = createAndFillWorkbookComplianceTableEflows(
            exportData,
        );
    } else {
        workbook = createAndFillWorkbookComplianceTableSecondAxis(
            exportData,
            timeSeriesType,
        );
    }

    triggerDownloadExcel(workbook, fileName);
};
