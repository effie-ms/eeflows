import * as Excel from 'exceljs/dist/exceljs.min.js'; // eslint-disable-line

export const createAndFillWorkbookComplianceTableEflows = (
    exportData,
) => {
    try {
        const workbook = new Excel.Workbook();
        const sheetMeasurementType = 'EF';

        const headers = [
            {
                header: 'Threshold type',
                key: 'threshold',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Spring Spawning',
                key: 'SS',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Rearing and Growth',
                key: 'RG',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Fall Spawning',
                key: 'FS',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Overwintering',
                key: 'OW',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
        ];

        const worksheetCompliant = workbook.addWorksheet(
            `${sheetMeasurementType}-compliant observations`,
        );
        worksheetCompliant.columns = headers;

        worksheetCompliant.addRow({
            threshold: 'Low',
            SS: exportData.springLowObserved.compliant,
            RG: exportData.summerLowObserved.compliant,
            FS: exportData.autumnLowObserved.compliant,
            OW: exportData.winterLowObserved.compliant,
        });

        const worksheetNoncompliant = workbook.addWorksheet(
            `${sheetMeasurementType}-noncompliant observations`,
        );
        worksheetNoncompliant.columns = headers;

        worksheetNoncompliant.addRow({
            threshold: 'Low',
            SS: exportData.springLowObserved.noncompliant,
            RG: exportData.summerLowObserved.noncompliant,
            FS: exportData.autumnLowObserved.noncompliant,
            OW: exportData.winterLowObserved.noncompliant,
        });

        return workbook;
    } catch {
        return null;
    }
};

export const createAndFillWorkbookComplianceTableSecondAxis = (
    exportData,
    timeSeriesType,
) => {
    try {
        const workbook = new Excel.Workbook();
        const sheetMeasurementType = timeSeriesType;

        const headers = [
            {
                header: 'Spring Spawning',
                key: 'SS',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Rearing and Growth',
                key: 'RG',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Fall Spawning',
                key: 'FS',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Overwintering',
                key: 'OW',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
        ];

        const worksheetCompliant = workbook.addWorksheet(
            `${sheetMeasurementType}-compliant observations`,
        );
        worksheetCompliant.columns = headers;

        worksheetCompliant.addRow({
            SS: exportData.springObserved.compliant,
            RG: exportData.summerObserved.compliant,
            FS: exportData.autumnObserved.compliant,
            OW: exportData.winterObserved.compliant,
        });

        const worksheetNoncompliant = workbook.addWorksheet(
            `${sheetMeasurementType}-noncompliant observations`,
        );
        worksheetNoncompliant.columns = headers;

        worksheetNoncompliant.addRow({
            SS: exportData.springObserved.noncompliant,
            RG: exportData.summerObserved.noncompliant,
            FS: exportData.autumnObserved.noncompliant,
            OW: exportData.winterObserved.noncompliant,
        });

        return workbook;
    } catch {
        return null;
    }
};
