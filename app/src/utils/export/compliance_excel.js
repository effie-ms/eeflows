/* eslint-disable */

import {
    getTimeSeriesNameByAbbreviation,
    getTimeSeriesUnitsByAbbreviation,
} from 'utils/text';

export const fillExcelContentEflowCompliance = (
    contentArray,
    measurementType,
    thresholdType,
    outWorkbook,
) => {
    const capitalizedMeasurementType = measurementType.replace(/^\w/, (c) =>
        c.toUpperCase(),
    );
    const worksheet = outWorkbook.addWorksheet(
        `${capitalizedMeasurementType} eflow`,
    );

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
    ];

    contentArray.map((arrItem) =>
        worksheet.addRow({
            date: arrItem.date,
            discharge:
                arrItem[`${measurementType}_discharge`] !== null
                    ? arrItem[`${measurementType}_discharge`]
                    : '-',
            threshold:
                arrItem[`${measurementType}_${thresholdType}_eflow_level`] !==
                null
                    ? arrItem[`${measurementType}_${thresholdType}_eflow_level`]
                    : '-',
            exceedsThreshold:
                arrItem[`${measurementType}_${thresholdType}_eflow_level`] !==
                    null && arrItem[`${measurementType}_discharge`] !== null
                    ? arrItem[`${measurementType}_discharge`] >
                      arrItem[`${measurementType}_${thresholdType}_eflow_level`]
                        ? 'yes'
                        : 'no'
                    : '-',
        }),
    );
    return outWorkbook;
};

export const fillExcelContentSecondAxisCompliance = (
    contentArray,
    measurementType,
    thresholdValue,
    tsType,
    outWorkbook,
) => {
    const capitalizedMeasurementType = measurementType.replace(/^\w/, (c) =>
        c.toUpperCase(),
    );
    const tsNameFull = getTimeSeriesNameByAbbreviation(tsType).toLowerCase();

    const worksheet = outWorkbook.addWorksheet(
        `${capitalizedMeasurementType} ${tsNameFull}`,
    );

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

    contentArray.map((arrItem) =>
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
        }),
    );

    return outWorkbook;
};

export const createAndFillWorkbookEflowCompliance = (
    eflowsTS,
    eflowsMeasurementType,
    workbook,
) => {
    try {
        if (eflowsMeasurementType === 'all') {
            workbook = fillExcelContentEflowCompliance(
                eflowsTS,
                'min',
                'low',
                workbook,
            );
            workbook = fillExcelContentEflowCompliance(
                eflowsTS,
                'avg',
                'low',
                workbook,
            );
            workbook = fillExcelContentEflowCompliance(
                eflowsTS,
                'max',
                'low',
                workbook,
            );
        } else {
            workbook = fillExcelContentEflowCompliance(
                eflowsTS,
                eflowsMeasurementType,
                'low',
                workbook,
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
            );
            workbook = fillExcelContentSecondAxisCompliance(
                eflowsTS,
                'avg',
                secondAxisThreshold,
                tsType,
                workbook,
            );
            workbook = fillExcelContentSecondAxisCompliance(
                eflowsTS,
                'max',
                secondAxisThreshold,
                tsType,
                workbook,
            );
        } else {
            workbook = fillExcelContentSecondAxisCompliance(
                eflowsTS,
                secondAxisMeasurementType,
                secondAxisThreshold,
                tsType,
                workbook,
            );
        }
        return workbook;
    } catch {
        return null;
    }
};
