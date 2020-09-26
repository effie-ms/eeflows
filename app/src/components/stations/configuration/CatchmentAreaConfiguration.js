import React from 'react';
import PropTypes from 'prop-types';

import { Input, Label } from 'reactstrap';

import { gettext } from 'utils/text';

export const CatchmentAreaConfiguration = ({
    catchmentArea,
    onSetCatchmentArea,
    areaFactor,
    onSetAreaFactor,
    watershed,
}) => (
    <>
        <div className="mt-3">
            <Label for="catchmentArea" className="config-label mb-2">
                {`${gettext('Catchment area')}: ${watershed} km`}
                <sup>2</sup>
            </Label>
            <Label for="catchmentArea" className="config-label">
                {gettext('Catchment area at the cross-section (km')}
                <sup>2</sup>):
            </Label>
            <Input
                type="number"
                className="mr-5"
                name="catchmentArea"
                id="catchmentArea"
                value={catchmentArea}
                placeholder={gettext('Catchment area')}
                onChange={e => onSetCatchmentArea(e.target.value)}
            />
        </div>
        <div className="mt-3 mb-3">
            <Label for="areaFactor" className="config-label">
                {gettext('Catchment area factor')}:
            </Label>
            <Input
                type="number"
                className="mr-5"
                name="areaFactor"
                id="areaFactor"
                value={areaFactor}
                placeholder={gettext('Catchment area factor')}
                onChange={e => onSetAreaFactor(e.target.value)}
            />
            <i>
                {gettext(
                    'Enter 0 in order not to divide by the factored catchment area.',
                )}
            </i>
        </div>
        <div className="my-3">
            <div
                className="bp3-callout bp3-intent-primary bp3-icon-info-sign"
                style={{ textAlign: 'justify' }}
            >
                <h4 className="bp3-heading">
                    {gettext('Catchment area scaling')}
                </h4>
                {gettext(
                    'Calculated long-term low flows are scaled by the catchment area in the following way:',
                )}
                <br />
                {gettext(
                    'scaled low flow = not scaled low flow * catchment area at the cross-section / (catchment area factor * catchment area)',
                )}
            </div>
        </div>
    </>
);

CatchmentAreaConfiguration.propTypes = {
    catchmentArea: PropTypes.number.isRequired,
    onSetCatchmentArea: PropTypes.func.isRequired,
    areaFactor: PropTypes.number.isRequired,
    onSetAreaFactor: PropTypes.func.isRequired,
    watershed: PropTypes.number.isRequired,
};
