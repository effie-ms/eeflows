import * as Excel from 'exceljs/dist/exceljs.min.js'; // eslint-disable-line

export const createAndFillWorkbookEflowUCUT = (exportData, showForecast) => {
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
            exportData.UCUTLowObserved.map(arrItem =>
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
        if (showForecast) {
            const worksheetLowPredicted = workbook.addWorksheet(
                'Low Flow UCUT-forecast',
            );
            worksheetLowPredicted.columns = [
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
                exportData.UCUTLowForecast !== null &&
                exportData.UCUTLowForecast.length > 0
            ) {
                exportData.UCUTLowForecast.map(arrItem =>
                    worksheetLowPredicted.addRow({
                        days: arrItem.daysDuration,
                        cumDuration: arrItem.cumulativeDuration,
                    }),
                );
            } else {
                worksheetLowPredicted.addRow({
                    days: 0,
                    cumDuration: 100,
                });
            }
        }
        const worksheetBase = workbook.addWorksheet('Base EF UCUT');
        worksheetBase.columns = [
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
            exportData.UCUTBaseObserved !== null &&
            exportData.UCUTBaseObserved.length > 0
        ) {
            exportData.UCUTBaseObserved.map(arrItem =>
                worksheetBase.addRow({
                    days: arrItem.daysDuration,
                    cumDuration: arrItem.cumulativeDuration,
                }),
            );
        } else {
            worksheetBase.addRow({
                days: 0,
                cumDuration: 100,
            });
        }
        if (showForecast) {
            const worksheetBasePredicted = workbook.addWorksheet(
                'Base EF UCUT-forecast',
            );
            worksheetBasePredicted.columns = [
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
                exportData.UCUTBaseForecast !== null &&
                exportData.UCUTBaseForecast.length > 0
            ) {
                exportData.UCUTBaseForecast.map(arrItem =>
                    worksheetBasePredicted.addRow({
                        days: arrItem.daysDuration,
                        cumDuration: arrItem.cumulativeDuration,
                    }),
                );
            } else {
                worksheetBasePredicted.addRow({
                    days: 0,
                    cumDuration: 100,
                });
            }
        }
        const worksheetCritical = workbook.addWorksheet('Critical EF UCUT');
        worksheetCritical.columns = [
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
            exportData.UCUTCriticalObserved !== null &&
            exportData.UCUTCriticalObserved.length > 0
        ) {
            exportData.UCUTCriticalObserved.map(arrItem =>
                worksheetCritical.addRow({
                    days: arrItem.daysDuration,
                    cumDuration: arrItem.cumulativeDuration,
                }),
            );
        } else {
            worksheetCritical.addRow({
                days: 0,
                cumDuration: 100,
            });
        }
        if (showForecast) {
            const worksheetCriticalPredicted = workbook.addWorksheet(
                'Critical EF UCUT-forecast',
            );
            worksheetCriticalPredicted.columns = [
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
                exportData.UCUTCriticalForecast !== null &&
                exportData.UCUTCriticalForecast.length > 0
            ) {
                exportData.UCUTCriticalForecast.map(arrItem =>
                    worksheetCriticalPredicted.addRow({
                        days: arrItem.daysDuration,
                        cumDuration: arrItem.cumulativeDuration,
                    }),
                );
            } else {
                worksheetCriticalPredicted.addRow({
                    days: 0,
                    cumDuration: 100,
                });
            }
        }
        const worksheetSubsistence = workbook.addWorksheet(
            'Subsistence EF UCUT',
        );
        worksheetSubsistence.columns = [
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
            exportData.UCUTSubsistenceObserved !== null &&
            exportData.UCUTSubsistenceObserved.length > 0
        ) {
            exportData.UCUTSubsistenceObserved.map(arrItem =>
                worksheetSubsistence.addRow({
                    days: arrItem.daysDuration,
                    cumDuration: arrItem.cumulativeDuration,
                }),
            );
        } else {
            worksheetSubsistence.addRow({
                days: 0,
                cumDuration: 100,
            });
        }
        if (showForecast) {
            const worksheetSubsistencePredicted = workbook.addWorksheet(
                'Subsistence EF UCUT-forecast',
            );
            worksheetSubsistencePredicted.columns = [
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
                exportData.UCUTSubsistenceForecast !== null &&
                exportData.UCUTSubsistenceForecast.length > 0
            ) {
                exportData.UCUTSubsistenceForecast.map(arrItem =>
                    worksheetSubsistencePredicted.addRow({
                        days: arrItem.daysDuration,
                        cumDuration: arrItem.cumulativeDuration,
                    }),
                );
            } else {
                worksheetSubsistencePredicted.addRow({
                    days: 0,
                    cumDuration: 100,
                });
            }
        }
        return workbook;
    } catch {
        return null;
    }
};

export const createAndFillWorkbookSecondAxisUCUT = (
    exportData,
    timeSeriesType,
    showForecast,
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
            exportData.UCUTObserved.map(arrItem =>
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

        if (showForecast) {
            const worksheetPredicted = workbook.addWorksheet(
                `${sheetName}-forecast`,
            );
            worksheetPredicted.columns = [
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
                exportData.UCUTForecast !== null &&
                exportData.UCUTForecast.length > 0
            ) {
                exportData.UCUTForecast.map(arrItem =>
                    worksheetPredicted.addRow({
                        days: arrItem.daysDuration,
                        cumDuration: arrItem.cumulativeDuration,
                    }),
                );
            } else {
                worksheetPredicted.addRow({
                    days: 0,
                    cumDuration: 100,
                });
            }
        }
        return workbook;
    } catch {
        return null;
    }
};
