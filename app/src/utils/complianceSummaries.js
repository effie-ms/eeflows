const getCompliancePercentages = pointsPerType => {
    const existingPoints = pointsPerType.filter(
        point => point.value && point.threshold,
    );

    const allCount = existingPoints.length;
    const compliantCount = existingPoints.filter(
        point => point.value > point.threshold,
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
    const valueThresholdPairs = pointsPerBioperiod.map(point => ({
        value: point[`avg_discharge${isForecast ? '_forecast' : ''}`],
        threshold:
            point[
                `avg_${eflowType.toLowerCase()}_eflow_level${
                    isForecast ? '_forecast' : ''
                }`
            ],
        date: point.date,
    }));

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
    const valueThresholdPairs = pointsPerBioperiod.map(point => ({
        value: point[`avg_second_axis_ts${isForecast ? '_forecast' : ''}`],
        threshold,
    }));

    return getCompliancePercentages(valueThresholdPairs);
};
