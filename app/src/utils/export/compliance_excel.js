/* eslint-disable */

import {
    getTimeSeriesNameByAbbreviation,
    getTimeSeriesUnitsByAbbreviation,
} from 'utils/text';

export const fillExcelContentEflowCompliance = (
    contentArray,
    measurementType,
    thresholdType,
    factored,
    outWorkbook,
    showFullForecastDischarge,
) => {
    const capitalizedMeasurementType = measurementType.replace(/^\w/, c =>
        c.toUpperCase(),
    );
    const worksheet = outWorkbook.addWorksheet(
        `${capitalizedMeasurementType} eflow`,
    );

    if (!showFullForecastDischarge) {
        worksheet.columns = [
            {
                header: 'Date',
                key: 'date',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} discharge [${getTimeSeriesUnitsByAbbreviation(
                    'EF',
                    true,
                )}]`,
                key: 'discharge',
                width: 20,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} eflow ${thresholdType} threshold [${getTimeSeriesUnitsByAbbreviation(
                    'EF',
                    factored,
                )}]`,
                key: 'threshold',
                width: 30,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `Exceeds ${thresholdType} threshold`,
                key: 'exceedsThreshold',
                width: 30,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Predicted',
                key: 'predicted',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
        ];
    } else {
        worksheet.columns = [
            {
                header: 'Date',
                key: 'date',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} discharge [${getTimeSeriesUnitsByAbbreviation(
                    'EF',
                    true,
                )}]`,
                key: 'discharge',
                width: 20,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} eflow ${thresholdType} threshold [${getTimeSeriesUnitsByAbbreviation(
                    'EF',
                    factored,
                )}]`,
                key: 'threshold',
                width: 30,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `Exceeds ${thresholdType} threshold`,
                key: 'exceedsThreshold',
                width: 30,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Predicted',
                key: 'predicted',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} discharge forecast [${getTimeSeriesUnitsByAbbreviation(
                    'EF',
                    true,
                )}]`,
                key: 'forecast',
                width: 35,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} eflow ${thresholdType} threshold forecast [${getTimeSeriesUnitsByAbbreviation(
                    'EF',
                    factored,
                )}]`,
                key: 'thresholdForecast',
                width: 40,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `Exceeds ${thresholdType} threshold forecast`,
                key: 'exceedsThresholdForecast',
                width: 30,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
        ];
    }

    if (showFullForecastDischarge) {
        contentArray.map(arrItem =>
            worksheet.addRow({
                date: arrItem.date,
                discharge:
                    arrItem[`${measurementType}_discharge`] !== null
                        ? arrItem[`${measurementType}_discharge`]
                        : '-',
                threshold:
                    arrItem[
                        `${measurementType}_${thresholdType}_eflow_level`
                    ] !== null
                        ? arrItem[
                              `${measurementType}_${thresholdType}_eflow_level`
                          ]
                        : '-',
                exceedsThreshold:
                    arrItem[
                        `${measurementType}_${thresholdType}_eflow_level`
                    ] !== null &&
                    arrItem[`${measurementType}_discharge`] !== null
                        ? arrItem[`${measurementType}_discharge`] >
                          arrItem[
                              `${measurementType}_${thresholdType}_eflow_level`
                          ]
                            ? 'yes'
                            : 'no'
                        : '-',
                predicted: arrItem[`${measurementType}_discharge_predicted`]
                    ? 'yes'
                    : 'no',
                forecast:
                    measurementType === 'avg' &&
                    arrItem[`${measurementType}_discharge_forecast`] !== null
                        ? arrItem[`${measurementType}_discharge_forecast`]
                        : '-',
                thresholdForecast:
                    measurementType === 'avg' &&
                    arrItem[
                        `${measurementType}_${thresholdType}_eflow_level_forecast`
                    ] !== null
                        ? arrItem[
                              `${measurementType}_${thresholdType}_eflow_level_forecast`
                          ]
                        : '-',
                exceedsThresholdForecast:
                    measurementType === 'avg' &&
                    arrItem[`${measurementType}_discharge_forecast`] !== null &&
                    arrItem[
                        `${measurementType}_${thresholdType}_eflow_level_forecast`
                    ] !== null
                        ? arrItem[`${measurementType}_discharge_forecast`] >
                          arrItem[
                              `${measurementType}_${thresholdType}_eflow_level_forecast`
                          ]
                            ? 'yes'
                            : 'no'
                        : '-',
            }),
        );
    } else {
        contentArray.map(arrItem =>
            worksheet.addRow({
                date: arrItem.date,
                discharge:
                    arrItem[`${measurementType}_discharge`] !== null
                        ? arrItem[`${measurementType}_discharge`]
                        : '-',
                threshold:
                    arrItem[
                        `${measurementType}_${thresholdType}_eflow_level`
                    ] !== null
                        ? arrItem[
                              `${measurementType}_${thresholdType}_eflow_level`
                          ]
                        : '-',
                exceedsThreshold:
                    arrItem[
                        `${measurementType}_${thresholdType}_eflow_level`
                    ] !== null &&
                    arrItem[`${measurementType}_discharge`] !== null
                        ? arrItem[`${measurementType}_discharge`] >
                          arrItem[
                              `${measurementType}_${thresholdType}_eflow_level`
                          ]
                            ? 'yes'
                            : 'no'
                        : '-',
                predicted: arrItem[`${measurementType}_discharge_predicted`]
                    ? 'yes'
                    : 'no',
            }),
        );
    }
    return outWorkbook;
};

export const fillExcelContentSecondAxisCompliance = (
    contentArray,
    measurementType,
    thresholdValue,
    tsType,
    outWorkbook,
    showFullForecastSecondAxis,
) => {
    const capitalizedMeasurementType = measurementType.replace(/^\w/, c =>
        c.toUpperCase(),
    );
    const tsNameFull = getTimeSeriesNameByAbbreviation(tsType).toLowerCase();

    const worksheet = outWorkbook.addWorksheet(
        `${capitalizedMeasurementType} ${tsNameFull}`,
    );
    if (!showFullForecastSecondAxis) {
        worksheet.columns = [
            {
                header: 'Date',
                key: 'date',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} ${tsType} [${getTimeSeriesUnitsByAbbreviation(
                    tsType,
                )}]`,
                key: 'secTS',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${tsType} threshold [${getTimeSeriesUnitsByAbbreviation(
                    tsType,
                )}]`,
                key: 'threshold',
                width: 20,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `Exceeds ${tsType} threshold`,
                key: 'exceedsThreshold',
                width: 20,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
        ];
    } else {
        worksheet.columns = [
            {
                header: 'Date',
                key: 'date',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} ${tsType} [${getTimeSeriesUnitsByAbbreviation(
                    tsType,
                )}]`,
                key: 'secTS',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${tsType} threshold [${getTimeSeriesUnitsByAbbreviation(
                    tsType,
                )}]`,
                key: 'threshold',
                width: 20,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `Exceeds ${tsType} threshold`,
                key: 'exceedsThreshold',
                width: 20,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: 'Predicted',
                key: 'predicted',
                width: 15,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `${capitalizedMeasurementType} ${tsType} forecast [${getTimeSeriesUnitsByAbbreviation(
                    tsType,
                )}]`,
                key: 'forecast',
                width: 25,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
            {
                header: `Exceeds threshold forecast`,
                key: 'exceedsThresholdForecast',
                width: 30,
                style: {
                    alignment: { vertical: 'middle', horizontal: 'center' },
                },
            },
        ];
    }

    if (showFullForecastSecondAxis) {
        contentArray.map(arrItem =>
            worksheet.addRow({
                date: arrItem.date,
                secTS:
                    arrItem[`${measurementType}_second_axis_ts`] !== null
                        ? arrItem[`${measurementType}_second_axis_ts`]
                        : '-',
                threshold: thresholdValue !== null ? thresholdValue : '-',
                exceedsThreshold:
                    arrItem[`${measurementType}_second_axis_ts`] !== null &&
                    thresholdValue !== null
                        ? arrItem[`${measurementType}_second_axis_ts`] >
                          thresholdValue
                            ? 'yes'
                            : 'no'
                        : '-',
                predicted: arrItem[
                    `${measurementType}_second_axis_ts_predicted`
                ]
                    ? 'yes'
                    : 'no',
                forecast:
                    measurementType === 'avg' &&
                    arrItem[`${measurementType}_second_axis_ts_forecast`] !==
                        null
                        ? arrItem[`${measurementType}_second_axis_ts_forecast`]
                        : '-',
                exceedsThresholdForecast:
                    measurementType === 'avg' &&
                    arrItem[`${measurementType}_second_axis_ts_forecast`] !==
                        null &&
                    thresholdValue !== null
                        ? arrItem[
                              `${measurementType}_second_axis_ts_forecast`
                          ] > thresholdValue
                            ? 'yes'
                            : 'no'
                        : '-',
            }),
        );
    } else {
        contentArray.map(arrItem =>
            worksheet.addRow({
                date: arrItem.date,
                secTS:
                    arrItem[`${measurementType}_second_axis_ts`] !== null
                        ? arrItem[`${measurementType}_second_axis_ts`]
                        : '-',
                threshold: thresholdValue !== null ? thresholdValue : '-',
                exceedsThreshold:
                    arrItem[`${measurementType}_second_axis_ts`] !== null &&
                    thresholdValue !== null
                        ? arrItem[`${measurementType}_second_axis_ts`] >
                          thresholdValue
                            ? 'yes'
                            : 'no'
                        : '-',
                predicted: arrItem[
                    `${measurementType}_second_axis_ts_predicted`
                ]
                    ? 'yes'
                    : 'no',
            }),
        );
    }

    return outWorkbook;
};

export const createAndFillWorkbookEflowCompliance = (
    eflowsTS,
    eflowsMeasurementType,
    eflowThreshold,
    factored,
    showForecast,
    workbook,
) => {
    try {
        if (eflowsMeasurementType === 'all') {
            workbook = fillExcelContentEflowCompliance(
                eflowsTS,
                'min',
                eflowThreshold,
                factored,
                workbook,
                showForecast,
            );
            workbook = fillExcelContentEflowCompliance(
                eflowsTS,
                'avg',
                eflowThreshold,
                factored,
                workbook,
                showForecast,
            );
            workbook = fillExcelContentEflowCompliance(
                eflowsTS,
                'max',
                eflowThreshold,
                factored,
                workbook,
                showForecast,
            );
        } else {
            workbook = fillExcelContentEflowCompliance(
                eflowsTS,
                eflowsMeasurementType,
                eflowThreshold,
                factored,
                workbook,
                showForecast,
            );
        }
        return workbook;
    } catch {
        return null;
    }
};

export const createAndFillWorkbookSecondAxisCompliance = (
    eflowsTS,
    secondAxisMeasurementType,
    secondAxisThreshold,
    tsType,
    showFullForecastSecondAxis,
    workbook,
) => {
    try {
        if (secondAxisMeasurementType === 'all') {
            workbook = fillExcelContentSecondAxisCompliance(
                eflowsTS,
                'min',
                secondAxisThreshold,
                tsType,
                workbook,
                showFullForecastSecondAxis,
            );
            workbook = fillExcelContentSecondAxisCompliance(
                eflowsTS,
                'avg',
                secondAxisThreshold,
                tsType,
                workbook,
                showFullForecastSecondAxis,
            );
            workbook = fillExcelContentSecondAxisCompliance(
                eflowsTS,
                'max',
                secondAxisThreshold,
                tsType,
                workbook,
                showFullForecastSecondAxis,
            );
        } else {
            workbook = fillExcelContentSecondAxisCompliance(
                eflowsTS,
                secondAxisMeasurementType,
                secondAxisThreshold,
                tsType,
                workbook,
                showFullForecastSecondAxis,
            );
        }
        return workbook;
    } catch {
        return null;
    }
};
