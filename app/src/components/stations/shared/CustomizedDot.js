import React from 'react';
import PropTypes from 'prop-types';

const HistoryPointSVG = ({ cx, cy, complianceColour, fillDot }) => (
    <circle
        cx={cx}
        cy={cy}
        r={3}
        key={`${cx}-${cy}`}
        fill={fillDot ? complianceColour : '#ffffff'}
        stroke={complianceColour}
        strokeWidth={2}
    />
);

HistoryPointSVG.propTypes = {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    complianceColour: PropTypes.string.isRequired,
    fillDot: PropTypes.bool.isRequired,
};

const ForecastPointSVG = ({ cx, cy, complianceColour, fillDot }) => (
    <rect
        x={cx - 3}
        y={cy - 4}
        key={`${cx}-${cy}`}
        width={6}
        height={6}
        fill={fillDot ? complianceColour : '#ffffff'}
        stroke={complianceColour}
        strokeWidth={2}
    />
);

ForecastPointSVG.propTypes = {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    complianceColour: PropTypes.string.isRequired,
    fillDot: PropTypes.bool.isRequired,
};

export const CustomizedDot = ({
    coord,
    measurementType,
    timeSeriesType,
    eflowType,
    isForecast,
    thresholdValue,
}) => {
    let measurementValue;
    let exceedsThreshold;
    let isPredicted;

    if (timeSeriesType === 'EF') {
        isPredicted = coord.payload[`${measurementType}_discharge_predicted`];
        measurementValue =
            coord.payload[
                `${measurementType}_discharge${isForecast ? '_forecast' : ''}`
            ];
        const threshold =
            coord.payload[
                `${measurementType}_${eflowType}_eflow_level${
                    isForecast ? '_forecast' : ''
                }`
            ];
        exceedsThreshold = measurementValue > threshold;
    } else {
        isPredicted =
            coord.payload[`${measurementType}_second_axis_ts_predicted`];
        measurementValue =
            coord.payload[
                `${measurementType}_second_axis_ts${
                    isForecast ? '_forecast' : ''
                }`
            ];
        exceedsThreshold = measurementValue > thresholdValue;
    }

    let exceedanceColour;
    if (timeSeriesType === 'EF' || timeSeriesType === 'WL') {
        exceedanceColour = exceedsThreshold ? 'green' : 'red';
    } else if (timeSeriesType === 'TW') {
        exceedanceColour = exceedsThreshold ? 'red' : 'green';
    }

    return (
        coord &&
        coord.cx &&
        coord.cy &&
        (isPredicted || isForecast ? (
            <ForecastPointSVG
                cx={coord.cx}
                cy={coord.cy}
                complianceColour={exceedanceColour}
                fillDot={timeSeriesType === 'EF'}
            />
        ) : (
            <HistoryPointSVG
                cx={coord.cx}
                cy={coord.cy}
                complianceColour={exceedanceColour}
                fillDot={timeSeriesType === 'EF'}
            />
        ))
    );
};

CustomizedDot.propTypes = {
    coord: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    measurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all']).isRequired,
    timeSeriesType: PropTypes.oneOf(['TW', 'WL', 'EF']).isRequired,
    eflowType: PropTypes.oneOf(['low', 'base', 'critical', 'subsistence']),
    isForecast: PropTypes.bool.isRequired,
    thresholdValue: PropTypes.number,
};

CustomizedDot.defaultProps = {
    coord: null,
    eflowType: null,
    thresholdValue: null,
};
