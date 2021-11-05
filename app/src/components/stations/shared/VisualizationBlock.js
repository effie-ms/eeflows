import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@blueprintjs/core';
import { gettext } from 'utils/text';
import { MeasurementTypeConfiguration } from './MeasurementTypeConfiguration';

export const VisualizationBlock = ({
    eflowMeasurementType,
    onSetEflowMeasurementType,
    secondAxisMeasurementType,
    onSetSecondAxisMeasurementType,
    showSecondaryAxis,
    setShowSecondaryAxis,
    secondAxisTimeSeriesType,
}) => (
    <div className="mt-0 mr-5">
        <div className="d-flex flex-column">
            <div className="mt-3">
                <h4 className="mb-0">{gettext('Primary axis')}</h4>
                <MeasurementTypeConfiguration
                    measurementType={eflowMeasurementType}
                    setMeasurementType={onSetEflowMeasurementType}
                    timeSeriesType="Q"
                />
            </div>
            <div className="mt-3">
                <h4 className="mb-0">{gettext('Secondary axis')}</h4>
                <Switch
                    className="mt-3"
                    style={{ fontSize: '1.0rem' }}
                    labelElement={gettext('Show a secondary axis')}
                    innerLabelChecked="yes"
                    innerLabel="no"
                    checked={showSecondaryAxis}
                    onChange={() => setShowSecondaryAxis(!showSecondaryAxis)}
                />
                <MeasurementTypeConfiguration
                    measurementType={secondAxisMeasurementType}
                    setMeasurementType={onSetSecondAxisMeasurementType}
                    timeSeriesType={secondAxisTimeSeriesType}
                />
            </div>
        </div>
    </div>
);

VisualizationBlock.propTypes = {
    eflowMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    onSetEflowMeasurementType: PropTypes.func.isRequired,
    secondAxisMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    onSetSecondAxisMeasurementType: PropTypes.func.isRequired,
    showSecondaryAxis: PropTypes.bool.isRequired,
    setShowSecondaryAxis: PropTypes.func.isRequired,
    secondAxisTimeSeriesType: PropTypes.oneOf(['TW', 'WL']).isRequired,
};
