import React from 'react';
import PropTypes from 'prop-types';

import { Button, Input, Label } from 'reactstrap';
import { Switch } from '@blueprintjs/core';

import { gettext } from 'utils/text';

import { MeasurementTypeConfiguration } from '../shared/MeasurementTypeConfiguration';

export const VisualizationBlock = ({
    eflowMeasurementType,
    onSetEflowMeasurementType,
    secondAxisMeasurementType,
    onSetSecondAxisMeasurementType,
    showSecondaryAxis,
    setShowSecondaryAxis,
    secondAxisTimeSeriesType,
    eflowThreshold,
    onSetEflowThreshold,
    showFullForecastDischarge,
    setShowFullForecastDischarge,
    showFullForecastSecondAxis,
    setShowFullForecastSecondAxis,
}) => (
    <div className="mt-0">
        <h5
            className="active nav-link pl-0 ml-3"
            style={{ width: 120, textAlign: 'justify' }}
        >
            {gettext('Visualization')}
        </h5>
        <div className="m-3">
            <div className="bp3-callout bp3-intent-primary bp3-icon-info-sign">
                <h4 className="bp3-heading">
                    {gettext('Changes in visualization parameters')}
                </h4>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'Changes in visualization parameters make the existing content reload dynamically. ' +
                            'It does not require clicking the button "Run estimation" if you have already ran ' +
                            'estimation.',
                    )}
                </span>
                <span style={{ display: 'list-item' }}>
                    {gettext(
                        'If there are any changes in the other parameters, please run estimation again.',
                    )}
                </span>
            </div>
        </div>
        <div className="d-flex flex-row justify-content-between">
            <div className="mt-3 ml-3" style={{ flexBasis: '50%' }}>
                <Button style={{ opacity: 1 }} color="dark" outline disabled>
                    <h4 className="mb-0">{gettext('Primary axis')}</h4>
                </Button>
                <MeasurementTypeConfiguration
                    measurementType={eflowMeasurementType}
                    setMeasurementType={onSetEflowMeasurementType}
                    timeSeriesType="Q"
                />
                <div className="eflow-type-configuration mt-3">
                    <h5>
                        {gettext('Select an environmental flow threshold type')}
                        :
                    </h5>
                    <div className="thresholds">
                        <div key="low">
                            <Input
                                type="radio"
                                name="low"
                                id="low"
                                onChange={() => onSetEflowThreshold('low')}
                                checked={eflowThreshold === 'low'}
                            />
                            <Label for="low">{gettext('Low flow')}</Label>
                        </div>
                        <div key="base">
                            <Input
                                type="radio"
                                name="base"
                                id="base"
                                onChange={() => onSetEflowThreshold('base')}
                                checked={eflowThreshold === 'base'}
                            />
                            <Label for="base">{gettext('Base flow')}</Label>
                        </div>
                        <div key="subsistence">
                            <Input
                                type="radio"
                                name="subsistence"
                                id="subsistence"
                                onChange={() =>
                                    onSetEflowThreshold('subsistence')
                                }
                                checked={eflowThreshold === 'subsistence'}
                            />
                            <Label for="subsistence">
                                {gettext('Subsistence flow')}
                            </Label>
                        </div>
                        <div key="critical">
                            <Input
                                type="radio"
                                name="critical"
                                id="critical"
                                onChange={() => onSetEflowThreshold('critical')}
                                checked={eflowThreshold === 'critical'}
                            />
                            <Label for="critical">
                                {gettext('Critical flow')}
                            </Label>
                        </div>
                    </div>
                </div>
                <Switch
                    className="mt-3"
                    style={{ fontSize: '1.0rem' }}
                    labelElement={gettext(
                        'Show mean values forecast for the whole date range',
                    )}
                    innerLabelChecked="yes"
                    innerLabel="no"
                    checked={showFullForecastDischarge}
                    onChange={() =>
                        setShowFullForecastDischarge(!showFullForecastDischarge)
                    }
                />
            </div>
            <div className="ml-3 mt-3" style={{ flexBasis: '50%' }}>
                <Button style={{ opacity: 1 }} color="dark" outline disabled>
                    <h4 className="mb-0">{gettext('Secondary axis')}</h4>
                </Button>
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
                <Switch
                    className="mt-3"
                    style={{ fontSize: '1.0rem' }}
                    labelElement={gettext(
                        'Show mean values forecast for the whole date range',
                    )}
                    innerLabelChecked="yes"
                    innerLabel="no"
                    checked={showFullForecastSecondAxis}
                    onChange={() =>
                        setShowFullForecastSecondAxis(
                            !showFullForecastSecondAxis,
                        )
                    }
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
    eflowThreshold: PropTypes.oneOf(['low', 'base', 'critical', 'subsistence'])
        .isRequired,
    onSetEflowThreshold: PropTypes.func.isRequired,
    showFullForecastDischarge: PropTypes.bool.isRequired,
    showFullForecastSecondAxis: PropTypes.bool.isRequired,
    setShowFullForecastDischarge: PropTypes.func.isRequired,
    setShowFullForecastSecondAxis: PropTypes.func.isRequired,
};
