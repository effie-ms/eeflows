import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export const CustomComplianceTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="recharts-default-tooltip custom-tooltip">
                <p>{moment(label).format('MMMM Do YYYY')}</p>
                {payload.map(
                    (arrItem) =>
                        !Number.isNaN(parseFloat(arrItem.value)) &&
                        !arrItem.dataKey.includes('range') && (
                            <p key={arrItem.dataKey}>
                                {arrItem.name}: {arrItem.value.toFixed(2)}{' '}
                                {arrItem.unit}
                            </p>
                        ),
                )}
            </div>
        );
    }

    return null;
};

CustomComplianceTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array, //eslint-disable-line
    label: PropTypes.string,
};

CustomComplianceTooltip.defaultProps = {
    active: false,
    payload: [],
    label: '',
};
