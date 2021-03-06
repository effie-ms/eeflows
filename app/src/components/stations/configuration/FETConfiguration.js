import React from 'react';
import PropTypes from 'prop-types';

import { Input } from 'reactstrap';

import { gettext } from 'utils/text';
import { FETInfoShape } from 'utils/types';

import { FishCoefficientsTable } from '../shared/FishCoefficientsTable';

export const FETConfiguration = ({
    fets,
    selectedFETId,
    onSetSelectedFETId,
}) => (
    <div className="d-flex flex-row mt-3">
        <div className="m-3" style={{ flexBasis: '50%' }}>
            <div className="fet-configuration">
                <h5>{gettext('Select a fish ecological type (FET)')}:</h5>
                <Input
                    type="select"
                    name="fet"
                    id="fet"
                    value={selectedFETId}
                    onChange={e => onSetSelectedFETId(e.target.value)}
                >
                    {fets.map(fet => (
                        <option value={fet.id} key={fet.id}>
                            {gettext(
                                `FET ${fet.fet_short_label}: ${fet.fet_name}`,
                            )}
                        </option>
                    ))}
                </Input>
            </div>
            <div className="my-3 mr-3" style={{ textAlign: 'justify' }}>
                <div className="bp3-callout bp3-intent-primary bp3-icon-info-sign">
                    <h4 className="bp3-heading">
                        {gettext('Environmental low flow calculation')}
                    </h4>
                    <span style={{ display: 'list-item' }}>
                        {gettext(
                            'Environmental low flow formula involves the calculation of the long-term low flow values' +
                                ' that are multiplied by the corresponding bioperiod coefficients of the ' +
                                'selected FET. ',
                        )}
                    </span>
                    <span style={{ display: 'list-item' }}>
                        {gettext(
                            'FET-specific bioperiod coefficients are presented in the "FET information" table. ',
                        )}
                    </span>
                    <span style={{ display: 'list-item' }}>
                        {gettext(
                            'The type of an environmental flow threshold can be chosen from the visualization ' +
                                'parameters.',
                        )}
                    </span>
                </div>
            </div>
        </div>
        <div className="m-3" style={{ flexBasis: '50%' }}>
            <h5>{gettext('FET information')}</h5>
            <FishCoefficientsTable fets={fets} />
        </div>
    </div>
);

FETConfiguration.propTypes = {
    fets: PropTypes.arrayOf(FETInfoShape),
    selectedFETId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    onSetSelectedFETId: PropTypes.func.isRequired,
};

FETConfiguration.defaultProps = {
    fets: [],
};
