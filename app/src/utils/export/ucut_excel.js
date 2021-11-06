import * as Excel from 'exceljs/dist/exceljs.min.js'; // eslint-disable-line

export const createAndFillWorkbookEflowUCUT = (exportData) => {
    try {
        const workbook = new Excel.Workbook();
        const worksheetLow = workbook.addWorksheet('Low Flow UCUT');
        worksheetLow.columns = [
            {
                header: 'Days duration',
                key: 'days',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Cumulative duration',
                key: 'cumDuration',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
        ];
        if (
            exportData.UCUTLowObserved !== null &&
            exportData.UCUTLowObserved.length > 0
        ) {
            exportData.UCUTLowObserved.map((arrItem) =>
                worksheetLow.addRow({
                    days: arrItem.daysDuration,
                    cumDuration: arrItem.cumulativeDuration,
                }),
            );
        } else {
            worksheetLow.addRow({
                days: 0,
                cumDuration: 100,
            });
        }
        return workbook;
    } catch {
        return null;
    }
};

export const createAndFillWorkbookSecondAxisUCUT = (
    exportData,
    timeSeriesType,
) => {
    try {
        const workbook = new Excel.Workbook();

        const sheetName = `${timeSeriesType} UCUT`;
        const worksheet = workbook.addWorksheet(`${sheetName}`);
        worksheet.columns = [
            {
                header: 'Days duration',
                key: 'days',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Cumulative duration',
                key: 'cumDuration',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
        ];
        if (
            exportData.UCUTObserved !== null &&
            exportData.UCUTObserved.length > 0
        ) {
            exportData.UCUTObserved.map((arrItem) =>
                worksheet.addRow({
                    days: arrItem.daysDuration,
                    cumDuration: arrItem.cumulativeDuration,
                }),
            );
        } else {
            worksheet.addRow({
                days: 0,
                cumDuration: 100,
            });
        }
        return workbook;
    } catch {
        return null;
    }
};
