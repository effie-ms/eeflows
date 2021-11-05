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

export const CustomizedDot = ({
    coord,
    measurementType,
    timeSeriesType,
    thresholdValue,
}) => {
    let measurementValue;
    let exceedsThreshold;

    if (timeSeriesType === 'EF') {
        measurementValue =
            coord.payload[
                `${measurementType}_discharge`
            ];
        const threshold =
            coord.payload[
                `${measurementType}_low_eflow_level`
            ];
        exceedsThreshold = measurementValue > threshold;
    } else {
        measurementValue =
            coord.payload[
                `${measurementType}_second_axis_ts`
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
        (
            <HistoryPointSVG
                cx={coord.cx}
                cy={coord.cy}
                complianceColour={exceedanceColour}
                fillDot={timeSeriesType === 'EF'}
            />
        )
    );
};

CustomizedDot.propTypes = {
    coord: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    measurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all']).isRequired,
    timeSeriesType: PropTypes.oneOf(['TW', 'WL', 'EF']).isRequired,
    thresholdValue: PropTypes.number,
};

CustomizedDot.defaultProps = {
    coord: null,
    thresholdValue: null,
};
