import React from 'react';
import PropTypes from 'prop-types';

export const SVGElementTimeSeriesType = ({ stroke, fill }) => (
    <svg
        className="recharts-surface"
        width={20}
        height={20}
        viewBox="0 0 40 40"
        version="1.1"
        style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '4px',
        }}
    >
        <path
            strokeWidth={4}
            fill={fill}
            stroke={stroke}
            d="M0,16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
            className="recharts-legend-icon"
        />
    </svg>
);

SVGElementTimeSeriesType.propTypes = {
    stroke: PropTypes.string.isRequired,
    fill: PropTypes.string.isRequired,
};

export const SVGElementThresholdType = ({ stroke }) => (
    <svg
        className="recharts-surface"
        width={40}
        height={20}
        viewBox="0 0 20 20"
        version="1.1"
        style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '4px',
        }}
    >
        <line
            x1="0"
            y1="10"
            x2="40"
            y2="10"
            style={{
                fill: 'none',
                strokeWidth: '3px',
                stroke,
                strokeDasharray: '10 5',
            }}
        />
    </svg>
);

SVGElementThresholdType.propTypes = {
    stroke: PropTypes.string.isRequired,
};

export const SVGElementLine = ({ stroke }) => (
    <svg
        className="recharts-surface"
        width={40}
        height={20}
        viewBox="0 0 20 20"
        version="1.1"
        style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '4px',
        }}
    >
        <line
            x1="0"
            y1="10"
            x2="40"
            y2="10"
            style={{ fill: 'none', strokeWidth: '3px', stroke }}
        />
    </svg>
);

SVGElementLine.propTypes = {
    stroke: PropTypes.string.isRequired,
};

export const SVGElementSquare = ({ fill }) => (
    <svg
        className="recharts-surface"
        width={10}
        height={10}
        viewBox="0 0 32 32"
        version="1.1"
        style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '4px',
        }}
    >
        <path
            fill={fill}
            className="recharts-symbols"
            transform="translate(16, 16)"
            d="M-16,-16h32v32h-32Z"
        />
    </svg>
);

SVGElementSquare.propTypes = {
    fill: PropTypes.string.isRequired,
};

export const SVGElementCircle = ({ fill }) => (
    <svg
        className="recharts-surface"
        width={10}
        height={10}
        viewBox="0 0 32 32"
        version="1.1"
        style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '4px',
        }}
    >
        <path
            fill={fill}
            className="recharts-symbols"
            transform="translate(16, 16)"
            d="M16,0A16,16,0,1,1,-16,0A16,16,0,1,1,16,0"
        />
    </svg>
);

SVGElementCircle.propTypes = {
    fill: PropTypes.string.isRequired,
};
