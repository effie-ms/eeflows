import React from 'react';
import PropTypes from 'prop-types';

import { Input, Label, Button } from 'reactstrap';

import {
    gettext,
    getTimeSeriesNameByAbbreviation,
    getTimeSeriesUnitsByAbbreviation,
} from 'utils/text';

export const MeasurementsConfiguration = ({
    secondAxisTimeSeriesType,
    onSetSecondAxisTimeSeriesType,
    secondAxisThreshold,
    onSetSecondAxisThreshold,
}) => (
    <div className="d-flex flex-row justify-content-between mt-3">
        <div className="m-3" style={{ flexBasis: '25%' }}>
            <div className="second-axis-toggle">
                <Button style={{ opacity: 1 }} color="dark" outline disabled>
                    <h4 className="mb-0">{gettext('Secondary axis')}</h4>
                </Button>
            </div>
            <div className="second-axis-selector d-flex flex-column mt-3">
                <h5>{gettext(`Select a secondary axis time series type`)}:</h5>
                <Input
                    type="select"
                    name="selectTimeSeriesType"
                    id="selectTimeSeriesType"
                    value={secondAxisTimeSeriesType}
                    onChange={e =>
                        onSetSecondAxisTimeSeriesType(e.target.value)
                    }
                >
                    <option value="TW">{gettext('Water temperature')}</option>
                    <option value="WL">{gettext('Water level')}</option>
                </Input>
            </div>
            <div className="mt-2 d-flex w-100 flex-column">
                <Label for="secondAxisThreshold" className="config-label">
                    {gettext(`${getTimeSeriesNameByAbbreviation(
                        secondAxisTimeSeriesType,
                    )} threshold
                    (${getTimeSeriesUnitsByAbbreviation(
                        secondAxisTimeSeriesType,
                        false,
                    )})`)}
                    :
                </Label>
                <Input
                    type="number"
                    name="secondAxisThreshold"
                    id="secondAxisThreshold"
                    value={secondAxisThreshold}
                    placeholder={`${getTimeSeriesNameByAbbreviation(
                        secondAxisTimeSeriesType,
                    )} threshold`}
                    onChange={e => onSetSecondAxisThreshold(e.target.value)}
                />
            </div>
        </div>
        <div className="m-3" style={{ flexBasis: '75%', textAlign: 'justify' }}>
            <div className="bp3-callout bp3-intent-primary bp3-icon-info-sign">
                <h4 className="bp3-heading">
                    {gettext('Compound event configuration')}
                </h4>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'There are 2 types of additional time series that can be configured: water temperature and ' +
                            'water level.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'Water temperature values are considered to be compliant when they are lower than the ' +
                            'specified threshold.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'Water level values are compliant when they exceed the specified threshold.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'The scale of the selected additional time series is shown on the secondary (right) ' +
                            'vertical axis.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'The visibility of the additional time series can be toggled from the ' +
                            'visualization configuration.',
                    )}
                </span>
            </div>
        </div>
    </div>
);

MeasurementsConfiguration.propTypes = {
    secondAxisTimeSeriesType: PropTypes.oneOf(['TW', 'WL']).isRequired,
    onSetSecondAxisTimeSeriesType: PropTypes.func.isRequired,
    secondAxisThreshold: PropTypes.number.isRequired,
    onSetSecondAxisThreshold: PropTypes.func.isRequired,
};
