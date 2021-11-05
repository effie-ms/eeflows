import React from 'react';
import PropTypes from 'prop-types';

import { Input } from 'reactstrap';

import { gettext, getTimeSeriesNameByAbbreviation } from 'utils/text';

export const MeasurementTypeConfiguration = ({
    measurementType,
    setMeasurementType,
    timeSeriesType,
}) => (
    <div className="measurement-configuration mt-3 d-flex flex-column">
        <h5>
            {gettext(
                `Select ${getTimeSeriesNameByAbbreviation(
                    timeSeriesType,
                ).toLowerCase()} measurement type`,
            )}
            :
        </h5>
        <Input
            type="select"
            name={`selectMeasurementType-${timeSeriesType}`}
            id={`${timeSeriesType}MeasurementType`}
            value={measurementType}
            onChange={(e) => setMeasurementType(e.target.value)}
        >
            <option value="all">{gettext('All (range)')}</option>
            <option value="min">{gettext('Minimum')}</option>
            <option value="avg">{gettext('Average')}</option>
            <option value="max">{gettext('Maximum')}</option>
        </Input>
    </div>
);

MeasurementTypeConfiguration.propTypes = {
    timeSeriesType: PropTypes.oneOf(['TW', 'WL', 'EF', 'Q']).isRequired,
    setMeasurementType: PropTypes.func.isRequired,
    measurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all']).isRequired,
};
