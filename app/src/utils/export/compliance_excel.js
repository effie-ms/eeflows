/* eslint-disable */

import {
    getTimeSeriesNameByAbbreviation,
    getTimeSeriesUnitsByAbbreviation,
} from 'utils/text';

const getEflowThresholdValue = (item, eflowType, measurementType) => {
    if (measurementType === 'min') {
        if (eflowType === 'low') {
            return item.min_low_eflow_level;
        }
        if (eflowType === 'base') {
            return item.min_base_eflow_level;
        }
        if (eflowType === 'subsistence') {
            return item.min_subsistence_eflow_level;
        }
        if (eflowType === 'critical') {
            return item.min_critical_eflow_level;
        }
    }
    if (measurementType === 'max') {
        if (eflowType === 'low') {
            return item.max_low_eflow_level;
        }
        if (eflowType === 'base') {
            return item.max_base_eflow_level;
        }
        if (eflowType === 'subsistence') {
            return item.max_subsistence_eflow_level;
        }
        if (eflowType === 'critical') {
            return item.max_critical_eflow_level;
        }
    }
    if (measurementType === 'avg') {
        if (eflowType === 'low') {
            return item.avg_low_eflow_level;
        }
        if (eflowType === 'base') {
            return item.avg_base_eflow_level;
        }
        if (eflowType === 'subsistence') {
            return item.avg_subsistence_eflow_level;
        }
        if (eflowType === 'critical') {
            return item.avg_critical_eflow_level;
        }
    }

    return null;
};

const getEflowForecastThresholdValue = (item, eflowType) => {
    if (eflowType === 'low') {
        return item.avg_low_eflow_level_forecast;
    }
    if (eflowType === 'base') {
        return item.avg_base_eflow_level_forecast;
    }
    if (eflowType === 'subsistence') {
        return item.avg_subsistence_eflow_level_forecast;
    }
    if (eflowType === 'critical') {
        return item.avg_critical_eflow_level_forecast;
    }
    return null;
};

const getEflowExceedanceValue = (item, eflowType, measurementType) => {
    if (measurementType === 'min') {
        if (eflowType === 'low') {
            return item.min_exceeds_low_eflow;
        }
        if (eflowType === 'base') {
            return item.min_exceeds_base_eflow;
        }
        if (eflowType === 'subsistence') {
            return item.min_exceeds_subsistence_eflow;
        }
        if (eflowType === 'critical') {
            return item.min_exceeds_critical_eflow;
        }
    }
    if (measurementType === 'max') {
        if (eflowType === 'low') {
            return item.max_exceeds_low_eflow;
        }
        if (eflowType === 'base') {
            return item.max_exceeds_base_eflow;
        }
        if (eflowType === 'subsistence') {
            return item.max_exceeds_subsistence_eflow;
        }
        if (eflowType === 'critical') {
            return item.max_exceeds_critical_eflow;
        }
    }
    if (measurementType === 'avg') {
        if (eflowType === 'low') {
            return item.avg_exceeds_low_eflow;
        }
        if (eflowType === 'base') {
            return item.avg_exceeds_base_eflow;
        }
        if (eflowType === 'subsistence') {
            return item.avg_exceeds_subsistence_eflow;
        }
        if (eflowType === 'critical') {
            return item.avg_exceeds_critical_eflow;
        }
    }

    return null;
};

const getEflowForecastExceedanceValue = (item, eflowType) => {
    if (eflowType === 'low') {
        return item.avg_exceeds_low_eflow_forecast;
    }
    if (eflowType === 'base') {
        return item.avg_exceeds_base_eflow_forecast;
    }
    if (eflowType === 'subsistence') {
        return item.avg_exceeds_subsistence_eflow_forecast;
    }
    if (eflowType === 'critical') {
        return item.avg_exceeds_critical_eflow_forecast;
    }

    return null;
};

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

    if (measurementType === 'min') {
        if (showFullForecastDischarge) {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    discharge:
                        arrItem.min_discharge !== null
                            ? arrItem.min_discharge
                            : '-',
                    threshold:
                        getEflowThresholdValue(
                            arrItem,
                            thresholdType,
                            measurementType,
                        ) !== null
                            ? getEflowThresholdValue(
                                  arrItem,
                                  thresholdType,
                                  measurementType,
                              )
                            : '-',
                    exceedsThreshold: getEflowExceedanceValue(
                        arrItem,
                        thresholdType,
                        measurementType,
                    )
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.min_discharge_predicted ? 'yes' : 'no',
                    forecast: '-',
                    thresholdForecast: '-',
                    exceedsThresholdForecast: '-',
                }),
            );
        } else {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    discharge:
                        arrItem.min_discharge !== null
                            ? arrItem.min_discharge
                            : '-',
                    threshold:
                        getEflowThresholdValue(
                            arrItem,
                            thresholdType,
                            measurementType,
                        ) !== null
                            ? getEflowThresholdValue(
                                  arrItem,
                                  thresholdType,
                                  measurementType,
                              )
                            : '-',
                    exceedsThreshold: getEflowExceedanceValue(
                        arrItem,
                        thresholdType,
                        measurementType,
                    )
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.min_discharge_predicted ? 'yes' : 'no',
                }),
            );
        }
    } else if (measurementType === 'avg') {
        if (showFullForecastDischarge) {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    discharge:
                        arrItem.avg_discharge !== null
                            ? arrItem.avg_discharge
                            : '-',
                    threshold:
                        getEflowThresholdValue(
                            arrItem,
                            thresholdType,
                            measurementType,
                        ) !== null
                            ? getEflowThresholdValue(
                                  arrItem,
                                  thresholdType,
                                  measurementType,
                              )
                            : '-',
                    exceedsThreshold: getEflowExceedanceValue(
                        arrItem,
                        thresholdType,
                        measurementType,
                    )
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.avg_discharge_predicted ? 'yes' : 'no',
                    forecast:
                        arrItem.avg_discharge_forecast !== null
                            ? arrItem.avg_discharge_forecast
                            : '-',
                    thresholdForecast:
                        getEflowForecastThresholdValue(
                            arrItem,
                            thresholdType,
                        ) !== null
                            ? getEflowForecastThresholdValue(
                                  arrItem,
                                  thresholdType,
                              )
                            : '-',
                    exceedsThresholdForecast:
                        getEflowForecastExceedanceValue(
                            arrItem,
                            thresholdType,
                        ) !== null
                            ? getEflowForecastExceedanceValue(
                                  arrItem,
                                  thresholdType,
                              )
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
                        arrItem.avg_discharge !== null
                            ? arrItem.avg_discharge
                            : '-',
                    threshold:
                        getEflowThresholdValue(
                            arrItem,
                            thresholdType,
                            measurementType,
                        ) !== null
                            ? getEflowThresholdValue(
                                  arrItem,
                                  thresholdType,
                                  measurementType,
                              )
                            : '-',
                    exceedsThreshold: getEflowExceedanceValue(
                        arrItem,
                        thresholdType,
                        measurementType,
                    )
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.avg_discharge_predicted ? 'yes' : 'no',
                }),
            );
        }
    } else if (measurementType === 'max') {
        if (showFullForecastDischarge) {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    discharge:
                        arrItem.max_discharge !== null
                            ? arrItem.max_discharge
                            : '-',
                    threshold:
                        getEflowThresholdValue(
                            arrItem,
                            thresholdType,
                            measurementType,
                        ) !== null
                            ? getEflowThresholdValue(
                                  arrItem,
                                  thresholdType,
                                  measurementType,
                              )
                            : '-',
                    exceedsThreshold: getEflowExceedanceValue(
                        arrItem,
                        thresholdType,
                        measurementType,
                    )
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.max_discharge_predicted ? 'yes' : 'no',
                    forecast: '-',
                    thresholdForecast: '-',
                    exceedsThresholdForecast: '-',
                }),
            );
        } else {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    discharge:
                        arrItem.max_discharge !== null
                            ? arrItem.max_discharge
                            : '-',
                    threshold:
                        getEflowThresholdValue(
                            arrItem,
                            thresholdType,
                            measurementType,
                        ) !== null
                            ? getEflowThresholdValue(
                                  arrItem,
                                  thresholdType,
                                  measurementType,
                              )
                            : '-',
                    exceedsThreshold: getEflowExceedanceValue(
                        arrItem,
                        thresholdType,
                        measurementType,
                    )
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.max_discharge_predicted ? 'yes' : 'no',
                }),
            );
        }
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
    if (measurementType === 'min') {
        if (showFullForecastSecondAxis) {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    secTS:
                        arrItem.min_second_axis_ts !== null
                            ? arrItem.min_second_axis_ts
                            : '-',
                    threshold: thresholdValue,
                    exceedsThreshold: arrItem.min_exceeds_second_axis_ts
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.min_second_axis_ts_predicted
                        ? 'yes'
                        : 'no',
                    forecast: '-',
                    exceedsThresholdForecast: '-',
                }),
            );
        } else {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    secTS:
                        arrItem.min_second_axis_ts !== null
                            ? arrItem.min_second_axis_ts
                            : '-',
                    threshold: thresholdValue,
                    exceedsThreshold: arrItem.min_exceeds_second_axis_ts
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.min_second_axis_ts_predicted
                        ? 'yes'
                        : 'no',
                }),
            );
        }
    } else if (measurementType === 'avg') {
        if (showFullForecastSecondAxis) {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    secTS:
                        arrItem.avg_second_axis_ts !== null
                            ? arrItem.avg_second_axis_ts
                            : '-',
                    threshold: thresholdValue,
                    exceedsThreshold: arrItem.avg_exceeds_second_axis_ts
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.avg_second_axis_ts_predicted
                        ? 'yes'
                        : 'no',
                    forecast:
                        arrItem.avg_second_axis_ts_forecast !== null
                            ? arrItem.avg_second_axis_ts_forecast
                            : '-',
                    exceedsThresholdForecast:
                        arrItem.avg_exceeds_second_axis_ts_forecast !== null
                            ? arrItem.avg_exceeds_second_axis_ts_forecast
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
                        arrItem.avg_second_axis_ts !== null
                            ? arrItem.avg_second_axis_ts
                            : '-',
                    threshold: thresholdValue,
                    exceedsThreshold: arrItem.avg_exceeds_second_axis_ts
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.avg_second_axis_ts_predicted
                        ? 'yes'
                        : 'no',
                }),
            );
        }
    } else if (measurementType === 'max') {
        if (showFullForecastSecondAxis) {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    secTS:
                        arrItem.max_second_axis_ts !== null
                            ? arrItem.max_second_axis_ts
                            : '-',
                    threshold: thresholdValue,
                    exceedsThreshold: arrItem.max_exceeds_second_axis_ts
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.max_second_axis_ts_predicted
                        ? 'yes'
                        : 'no',
                    forecast: '-',
                    exceedsThresholdForecast: '-',
                }),
            );
        } else {
            contentArray.map(arrItem =>
                worksheet.addRow({
                    date: arrItem.date,
                    secTS:
                        arrItem.max_second_axis_ts !== null
                            ? arrItem.max_second_axis_ts
                            : '-',
                    threshold: thresholdValue,
                    exceedsThreshold: arrItem.max_exceeds_second_axis_ts
                        ? 'yes'
                        : 'no',
                    predicted: arrItem.max_second_axis_ts_predicted
                        ? 'yes'
                        : 'no',
                }),
            );
        }
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
