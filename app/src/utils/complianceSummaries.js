import { getEflowValueByType, getSecondaryAxisTSValue } from 'utils/flowValues';

const getCompliancePercentages = pointsPerType => {
    const existingPoints = pointsPerType.filter(
        point => point.value && point.threshold,
    );

    const allCount = existingPoints.length;
    const compliantCount = existingPoints.filter(
        point => point.value >= point.threshold,
    ).length;

    let compliantPercentageValue;
    let noncompliantPercentageValue;
    if (allCount !== 0) {
        compliantPercentageValue = ((compliantCount / allCount) * 100).toFixed(
            2,
        );
        noncompliantPercentageValue = (100 - compliantPercentageValue).toFixed(
            2,
        );
    }

    const compliantPercentage = compliantPercentageValue
        ? `${compliantPercentageValue}%`
        : '-';
    const noncompliantPercentage = noncompliantPercentageValue
        ? `${noncompliantPercentageValue}%`
        : '-';

    return {
        compliant: compliantPercentage,
        noncompliant: noncompliantPercentage,
    };
};

export const getCompliancePercentagesEflow = (
    eflowsTS,
    bioperiod,
    eflowType,
    isForecast,
) => {
    const pointsPerBioperiod = eflowsTS.filter(
        point => point.bioperiod === bioperiod,
    );
    const valueThresholdPairs = pointsPerBioperiod.map(point =>
        getEflowValueByType(point, eflowType, isForecast),
    );

    return getCompliancePercentages(valueThresholdPairs);
};

export const getCompliancePercentagesSecondaryAxisTS = (
    eflowsTS,
    bioperiod,
    threshold,
    isForecast,
) => {
    const pointsPerBioperiod = eflowsTS.filter(
        point => point.bioperiod === bioperiod,
    );
    const valueThresholdPairs = pointsPerBioperiod.map(point =>
        getSecondaryAxisTSValue(point, threshold, isForecast),
    );

    return getCompliancePercentages(valueThresholdPairs);
};
