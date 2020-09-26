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
    cx,
    cy,
    exceedsEflow,
    exceedsSecondAxis,
    forecastEflow,
    forecastSecondAxis,
    entityKey,
}) => {
    const exceedsEflowColour = exceedsEflow ? 'green' : 'red';
    let exceedsSecondAxisColour = exceedsSecondAxis ? 'red' : 'green';
    if (entityKey === 'WL') {
        exceedsSecondAxisColour = exceedsSecondAxis ? 'green' : 'red';
    }

    if (entityKey === 'EF') {
        if (forecastEflow) {
            return (
                <ForecastPointSVG
                    cx={cx}
                    cy={cy}
                    complianceColour={exceedsEflowColour}
                    fillDot
                />
            );
        } else {
            return (
                <HistoryPointSVG
                    cx={cx}
                    cy={cy}
                    complianceColour={exceedsEflowColour}
                    fillDot
                />
            );
        }
    } else {
        if (forecastSecondAxis) {
            return (
                <ForecastPointSVG
                    cx={cx}
                    cy={cy}
                    complianceColour={exceedsSecondAxisColour}
                    fillDot={false}
                />
            );
        }
        return (
            <HistoryPointSVG
                cx={cx}
                cy={cy}
                complianceColour={exceedsSecondAxisColour}
                fillDot={false}
            />
        );
    }
};

CustomizedDot.propTypes = {
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
    entityKey: PropTypes.oneOf(['TW', 'WL', 'EF', 'Q']).isRequired,
    exceedsEflow: PropTypes.bool,
    exceedsSecondAxis: PropTypes.bool,
    forecastEflow: PropTypes.bool,
    forecastSecondAxis: PropTypes.bool,
};

CustomizedDot.defaultProps = {
    exceedsEflow: null,
    exceedsSecondAxis: null,
    forecastEflow: null,
    forecastSecondAxis: null,
};
