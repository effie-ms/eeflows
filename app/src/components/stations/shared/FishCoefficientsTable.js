import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'reactstrap';

import { FETInfoShape } from 'utils/types';
import { gettext } from 'utils/text';

export const FishCoefficientsTable = ({ fets }) => (
    <Table bordered striped className="fish-coefficients-table">
        <thead>
            <tr>
                <th>{gettext('FET')}</th>
                <th>{gettext('Threshold')}</th>
                <th>{gettext('Spring Spawning (March-June)')}</th>
                <th>{gettext('Rearing and Growth (July-September)')}</th>
                <th>{gettext('Fall Spawning (October-December)')}</th>
                <th>{gettext('Overwintering (January-February)')}</th>
            </tr>
        </thead>
        <tbody>
            {fets.map(fet => (
                <tr key={`${fet.fet_short_label}`}>
                    <th scope="row">{fet.fet_short_label}</th>
                    <td>
                        <p>{gettext('Base')}</p>
                        <p>{gettext('Critical')}</p>
                        <p>{gettext('Subsistence')}</p>
                    </td>
                    <td>
                        <p>{fet.base_p_coefficients.spring}</p>
                        <p>{fet.critical_p_coefficients.spring}</p>
                        <p>{fet.subsistence_p_coefficients.spring}</p>
                    </td>
                    <td>
                        <p>{fet.base_p_coefficients.summer}</p>
                        <p>{fet.critical_p_coefficients.summer}</p>
                        <p>{fet.subsistence_p_coefficients.summer}</p>
                    </td>
                    <td>
                        <p>{fet.base_p_coefficients.autumn}</p>
                        <p>{fet.critical_p_coefficients.autumn}</p>
                        <p>{fet.subsistence_p_coefficients.autumn}</p>
                    </td>
                    <td>
                        <p>{fet.base_p_coefficients.winter}</p>
                        <p>{fet.critical_p_coefficients.winter}</p>
                        <p>{fet.subsistence_p_coefficients.winter}</p>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
);

FishCoefficientsTable.propTypes = {
    fets: PropTypes.arrayOf(FETInfoShape),
};

FishCoefficientsTable.defaultProps = {
    fets: [],
};
