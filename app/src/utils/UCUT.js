const count = arr => {
    return arr.reduce((counter, item) => {
        const p = String(item);
        counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1; // eslint-disable-line
        return counter;
    }, {});
};

const getCumulativeDurations = (valueThresholdDateTuples, isUnderThreshold) => {
    const sortedPoints = valueThresholdDateTuples.sort(
        (a, b) => b.date - a.date,
    );

    const complianceFlags = sortedPoints.map(point => {
        if (isUnderThreshold) {
            return point.value < point.threshold ? 1 : 0;
        } else {
            return point.value > point.threshold ? 1 : 0;
        }
    });

    const cumDurations = [];
    let tempCumDuration = 0;
    for (let i = 0; i < complianceFlags.length; i++) {
        if (complianceFlags[i] === 1) {
            tempCumDuration += 1;
        } else {
            // Push previously counted duration
            if (tempCumDuration !== 0) {
                cumDurations.push(tempCumDuration);
            }

            // Reset counter
            tempCumDuration = 0;
        }
    }

    // Push the last one
    if (tempCumDuration !== 0) {
        cumDurations.push(tempCumDuration);
    }

    // Sort in decreasing order
    const sortedCumDurations = cumDurations.sort((a, b) => a - b);
    const cumulativeDurationsDict = count(sortedCumDurations);

    const durationsArray = Object.keys(cumulativeDurationsDict).map(
        duration => ({
            daysDuration: Number(duration),
            cumulativeDuration:
                ((Number(duration) * cumulativeDurationsDict[duration]) /
                    sortedPoints.length) *
                100,
        }),
    );

    const sortedDurationsArray = durationsArray.sort(
        (a, b) => b.daysDuration - a.daysDuration,
    );

    const cumulativeDurationsArray = [];
    for (let i = 0; i < sortedDurationsArray.length; i++) {
        const durationDict = sortedDurationsArray[i];
        cumulativeDurationsArray.push({
            daysDuration: durationDict.daysDuration,
            cumulativeDuration:
                i === 0
                    ? durationDict.cumulativeDuration
                    : durationDict.cumulativeDuration +
                      cumulativeDurationsArray[i - 1].cumulativeDuration,
        });
    }

    return cumulativeDurationsArray;
};

export const getCumulativeDurationsEflows = (
    eflowsTS,
    eflowType,
    isForecast,
) => {
    const valueThresholdDateTuples = eflowsTS.map(point => ({
        value: point[`avg_discharge${isForecast ? '_forecast' : ''}`],
        threshold:
            point[
                `avg_${eflowType.toLowerCase()}_eflow_level${
                    isForecast ? '_forecast' : ''
                }`
            ],
        date: point.date,
    }));

    return getCumulativeDurations(valueThresholdDateTuples, true);
};

export const getCumulativeDurationsSecondaryAxisTS = (
    eflowsTS,
    threshold,
    isForecast,
    isUnderThreshold,
) => {
    const valueThresholdDateTuples = eflowsTS.map(point => ({
        value: point[`avg_second_axis_ts${isForecast ? '_forecast' : ''}`],
        threshold,
        date: point.date,
    }));

    return getCumulativeDurations(valueThresholdDateTuples, isUnderThreshold);
};
