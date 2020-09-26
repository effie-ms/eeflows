import * as Excel from 'exceljs/dist/exceljs.min.js'; // eslint-disable-line

export const createAndFillWorkbookComplianceTableEflows = (
    exportData,
    showForecast,
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

        worksheetCompliant.addRow({
            threshold: 'Base',
            SS: exportData.springBaseObserved.compliant,
            RG: exportData.summerBaseObserved.compliant,
            FS: exportData.autumnBaseObserved.compliant,
            OW: exportData.winterBaseObserved.compliant,
        });
        worksheetCompliant.addRow({
            threshold: 'Critical',
            SS: exportData.springCriticalObserved.compliant,
            RG: exportData.summerCriticalObserved.compliant,
            FS: exportData.autumnCriticalObserved.compliant,
            OW: exportData.winterCriticalObserved.compliant,
        });
        worksheetCompliant.addRow({
            threshold: 'Subsistence',
            SS: exportData.springSubsistenceObserved.compliant,
            RG: exportData.summerSubsistenceObserved.compliant,
            FS: exportData.autumnSubsistenceObserved.compliant,
            OW: exportData.winterSubsistenceObserved.compliant,
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
        worksheetNoncompliant.addRow({
            threshold: 'Base',
            SS: exportData.springBaseObserved.noncompliant,
            RG: exportData.summerBaseObserved.noncompliant,
            FS: exportData.autumnBaseObserved.noncompliant,
            OW: exportData.winterBaseObserved.noncompliant,
        });
        worksheetNoncompliant.addRow({
            threshold: 'Critical',
            SS: exportData.springCriticalObserved.noncompliant,
            RG: exportData.summerCriticalObserved.noncompliant,
            FS: exportData.autumnCriticalObserved.noncompliant,
            OW: exportData.winterCriticalObserved.noncompliant,
        });
        worksheetNoncompliant.addRow({
            threshold: 'Subsistence',
            SS: exportData.springSubsistenceObserved.noncompliant,
            RG: exportData.summerSubsistenceObserved.noncompliant,
            FS: exportData.autumnSubsistenceObserved.noncompliant,
            OW: exportData.winterSubsistenceObserved.noncompliant,
        });

        if (showForecast) {
            const worksheetCompliantPredicted = workbook.addWorksheet(
                `${sheetMeasurementType}-compliant predictions`,
            );
            worksheetCompliantPredicted.columns = headers;

            worksheetCompliantPredicted.addRow({
                threshold: 'Low',
                SS: exportData.springLowForecast.compliant,
                RG: exportData.summerLowForecast.compliant,
                FS: exportData.autumnLowForecast.compliant,
                OW: exportData.winterLowForecast.compliant,
            });

            worksheetCompliantPredicted.addRow({
                threshold: 'Base',
                SS: exportData.springBaseForecast.compliant,
                RG: exportData.summerBaseForecast.compliant,
                FS: exportData.autumnBaseForecast.compliant,
                OW: exportData.winterBaseForecast.compliant,
            });
            worksheetCompliantPredicted.addRow({
                threshold: 'Critical',
                SS: exportData.springCriticalForecast.compliant,
                RG: exportData.summerCriticalForecast.compliant,
                FS: exportData.autumnCriticalForecast.compliant,
                OW: exportData.winterCriticalForecast.compliant,
            });
            worksheetCompliantPredicted.addRow({
                threshold: 'Subsistence',
                SS: exportData.springSubsistenceForecast.compliant,
                RG: exportData.summerSubsistenceForecast.compliant,
                FS: exportData.autumnSubsistenceForecast.compliant,
                OW: exportData.winterSubsistenceForecast.compliant,
            });

            const worksheetNoncompliantPredicted = workbook.addWorksheet(
                `${sheetMeasurementType}-noncompliant predictions`,
            );
            worksheetNoncompliantPredicted.columns = headers;

            worksheetNoncompliantPredicted.addRow({
                threshold: 'Low',
                SS: exportData.springLowForecast.noncompliant,
                RG: exportData.summerLowForecast.noncompliant,
                FS: exportData.autumnLowForecast.noncompliant,
                OW: exportData.winterLowForecast.noncompliant,
            });

            worksheetNoncompliantPredicted.addRow({
                threshold: 'Base',
                SS: exportData.springBaseForecast.noncompliant,
                RG: exportData.summerBaseForecast.noncompliant,
                FS: exportData.autumnBaseForecast.noncompliant,
                OW: exportData.winterBaseForecast.noncompliant,
            });
            worksheetNoncompliantPredicted.addRow({
                threshold: 'Critical',
                SS: exportData.springCriticalForecast.noncompliant,
                RG: exportData.summerCriticalForecast.noncompliant,
                FS: exportData.autumnCriticalForecast.noncompliant,
                OW: exportData.winterCriticalForecast.noncompliant,
            });
            worksheetNoncompliantPredicted.addRow({
                threshold: 'Subsistence',
                SS: exportData.springSubsistenceForecast.noncompliant,
                RG: exportData.summerSubsistenceForecast.noncompliant,
                FS: exportData.autumnSubsistenceForecast.noncompliant,
                OW: exportData.winterSubsistenceForecast.noncompliant,
            });
        }

        return workbook;
    } catch {
        return null;
    }
};

export const createAndFillWorkbookComplianceTableSecondAxis = (
    exportData,
    timeSeriesType,
    showForecast,
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

        if (showForecast) {
            const worksheetCompliantPredicted = workbook.addWorksheet(
                `${sheetMeasurementType}-compliant predictions`,
            );
            worksheetCompliantPredicted.columns = headers;

            worksheetCompliantPredicted.addRow({
                SS: exportData.springForecast.compliant,
                RG: exportData.summerForecast.compliant,
                FS: exportData.autumnForecast.compliant,
                OW: exportData.winterForecast.compliant,
            });

            const worksheetNoncompliantPredicted = workbook.addWorksheet(
                `${sheetMeasurementType}-noncompliant predictions`,
            );
            worksheetNoncompliantPredicted.columns = headers;

            worksheetNoncompliantPredicted.addRow({
                SS: exportData.springForecast.noncompliant,
                RG: exportData.summerForecast.noncompliant,
                FS: exportData.autumnForecast.noncompliant,
                OW: exportData.winterForecast.noncompliant,
            });
        }

        return workbook;
    } catch {
        return null;
    }
};
