import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import { Card, Elevation, Divider, Button } from '@blueprintjs/core';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import { FETInfoShape } from 'utils/types';
import { gettext } from 'utils/text';

import { LowFlowTabPane } from 'components/stations/configuration/LowFlowTabPane';
import { FETConfiguration } from 'components/stations/configuration/FETConfiguration';
import { MeasurementsConfiguration } from 'components/stations/configuration/MeasurementsConfiguration';
import { VisualizationBlock } from 'components/stations/configuration/VisualizationBlock';
import { ForecastingTabPane } from 'components/stations/configuration/ForecastingTabPane';

export const Configuration = ({
    startDate,
    endDate,
    onSetDateRange,
    catchmentArea,
    onSetCatchmentArea,
    areaFactor,
    onSetAreaFactor,
    eflowThreshold,
    onSetEflowThreshold,
    fets,
    selectedFETId,
    onSetSelectedFETId,
    eflowMeasurementType,
    onSetEflowMeasurementType,
    secondAxisMeasurementType,
    onSetSecondAxisMeasurementType,
    secondAxisTimeSeriesType,
    onSetSecondAxisTimeSeriesType,
    secondAxisThreshold,
    onSetSecondAxisThreshold,
    showSecondaryAxis,
    setShowSecondaryAxis,
    fillMissingValuesDischarge,
    setFillMissingValuesDischarge,
    showFullForecastDischarge,
    setShowFullForecastDischarge,
    multiStationsForecastDischarge,
    setMultiStationsForecastDischarge,
    fillMissingValuesSecondAxis,
    setFillMissingValuesSecondAxis,
    showFullForecastSecondAxis,
    setShowFullForecastSecondAxis,
    multiStationsForecastSecondAxis,
    setMultiStationsForecastSecondAxis,
    forecastEflowsVariable,
    setForecastEflowsVariable,
    forecastSecondAxisVariable,
    setForecastSecondAxisVariable,
    meanLowFlowMethod,
    onSetMeanLowFlowMethod,
    meanLowFlowMethodFrequency,
    onSetMeanLowFlowMethodFrequency,
    multiplyByFishCoefficients,
    onSetMultiplyByFishCoefficients,
    onRunEstimation,
    watershed,
    enableForecasting,
    setEnableForecasting,
}) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    return (
        <div className="configuration">
            <Card
                interactive="true"
                elevation={Elevation.THREE}
                style={{ backgroundColor: '#ebf1f5' }}
            >
                <Card elevation={Elevation.TWO}>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames(
                                    { active: activeTab === '1' },
                                    'pl-0',
                                    'ml-3',
                                )}
                                onClick={() => {
                                    toggle('1');
                                }}
                            >
                                {gettext('Low flow parameters')}
                            </NavLink>
                        </NavItem>
                        <Divider />
                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === '2',
                                })}
                                onClick={() => {
                                    toggle('2');
                                }}
                            >
                                {gettext('Environmental low flow formula')}
                            </NavLink>
                        </NavItem>
                        <Divider />
                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === '3',
                                })}
                                onClick={() => {
                                    toggle('3');
                                }}
                            >
                                {gettext('Compound event')}
                            </NavLink>
                        </NavItem>
                        <Divider />
                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === '4',
                                })}
                                onClick={() => {
                                    toggle('4');
                                }}
                            >
                                {gettext('Forecasting')}
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <LowFlowTabPane
                                startDate={startDate}
                                endDate={endDate}
                                onSetDateRange={onSetDateRange}
                                meanLowFlowMethod={meanLowFlowMethod}
                                onSetMeanLowFlowMethod={onSetMeanLowFlowMethod}
                                meanLowFlowMethodFrequency={
                                    meanLowFlowMethodFrequency
                                }
                                onSetMeanLowFlowMethodFrequency={
                                    onSetMeanLowFlowMethodFrequency
                                }
                                catchmentArea={catchmentArea}
                                onSetCatchmentArea={onSetCatchmentArea}
                                areaFactor={areaFactor}
                                onSetAreaFactor={onSetAreaFactor}
                                watershed={watershed}
                            />
                        </TabPane>
                        <TabPane tabId="2">
                            <FETConfiguration
                                fets={fets}
                                selectedFETId={selectedFETId}
                                onSetSelectedFETId={onSetSelectedFETId}
                                multiplyByFishCoefficients={
                                    multiplyByFishCoefficients
                                }
                                onSetMultiplyByFishCoefficients={
                                    onSetMultiplyByFishCoefficients
                                }
                            />
                        </TabPane>
                        <TabPane tabId="3">
                            <MeasurementsConfiguration
                                secondAxisTimeSeriesType={
                                    secondAxisTimeSeriesType
                                }
                                onSetSecondAxisTimeSeriesType={
                                    onSetSecondAxisTimeSeriesType
                                }
                                secondAxisThreshold={secondAxisThreshold}
                                onSetSecondAxisThreshold={
                                    onSetSecondAxisThreshold
                                }
                            />
                        </TabPane>
                        <TabPane tabId="4">
                            <ForecastingTabPane
                                fillMissingValuesDischarge={
                                    fillMissingValuesDischarge
                                }
                                setFillMissingValuesDischarge={
                                    setFillMissingValuesDischarge
                                }
                                multiStationsForecastDischarge={
                                    multiStationsForecastDischarge
                                }
                                setMultiStationsForecastDischarge={
                                    setMultiStationsForecastDischarge
                                }
                                fillMissingValuesSecondAxis={
                                    fillMissingValuesSecondAxis
                                }
                                setFillMissingValuesSecondAxis={
                                    setFillMissingValuesSecondAxis
                                }
                                multiStationsForecastSecondAxis={
                                    multiStationsForecastSecondAxis
                                }
                                setMultiStationsForecastSecondAxis={
                                    setMultiStationsForecastSecondAxis
                                }
                                forecastEflowsVariable={forecastEflowsVariable}
                                setForecastEflowsVariable={
                                    setForecastEflowsVariable
                                }
                                forecastSecondAxisVariable={
                                    forecastSecondAxisVariable
                                }
                                setForecastSecondAxisVariable={
                                    setForecastSecondAxisVariable
                                }
                                enableForecasting={enableForecasting}
                                setEnableForecasting={setEnableForecasting}
                            />
                        </TabPane>
                    </TabContent>
                    <div className="d-flex justify-content-end">
                        <Button
                            intent="success"
                            text="Run estimation"
                            style={{ height: 40 }}
                            className="align-self-end mr-3"
                            onClick={() => onRunEstimation()}
                        />
                    </div>
                </Card>
                <Card elevation={Elevation.TWO} className="mt-3">
                    <VisualizationBlock
                        eflowMeasurementType={eflowMeasurementType}
                        onSetEflowMeasurementType={onSetEflowMeasurementType}
                        secondAxisMeasurementType={secondAxisMeasurementType}
                        onSetSecondAxisMeasurementType={
                            onSetSecondAxisMeasurementType
                        }
                        secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                        showSecondaryAxis={showSecondaryAxis}
                        setShowSecondaryAxis={setShowSecondaryAxis}
                        eflowThreshold={eflowThreshold}
                        onSetEflowThreshold={onSetEflowThreshold}
                        showFullForecastDischarge={showFullForecastDischarge}
                        setShowFullForecastDischarge={
                            setShowFullForecastDischarge
                        }
                        showFullForecastSecondAxis={showFullForecastSecondAxis}
                        setShowFullForecastSecondAxis={
                            setShowFullForecastSecondAxis
                        }
                    />
                </Card>
            </Card>
        </div>
    );
};

Configuration.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    onSetDateRange: PropTypes.func.isRequired,
    catchmentArea: PropTypes.number.isRequired,
    onSetCatchmentArea: PropTypes.func.isRequired,
    areaFactor: PropTypes.number.isRequired,
    onSetAreaFactor: PropTypes.func.isRequired,
    eflowThreshold: PropTypes.oneOf(['low', 'base', 'critical', 'subsistence'])
        .isRequired,
    onSetEflowThreshold: PropTypes.func.isRequired,
    fets: PropTypes.arrayOf(FETInfoShape),
    selectedFETId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    onSetSelectedFETId: PropTypes.func.isRequired,
    eflowMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    onSetEflowMeasurementType: PropTypes.func.isRequired,
    secondAxisMeasurementType: PropTypes.oneOf(['min', 'avg', 'max', 'all'])
        .isRequired,
    onSetSecondAxisMeasurementType: PropTypes.func.isRequired,
    secondAxisTimeSeriesType: PropTypes.oneOf(['TW', 'WL']).isRequired,
    onSetSecondAxisTimeSeriesType: PropTypes.func.isRequired,
    secondAxisThreshold: PropTypes.number.isRequired,
    onSetSecondAxisThreshold: PropTypes.func.isRequired,
    showSecondaryAxis: PropTypes.bool.isRequired,
    setShowSecondaryAxis: PropTypes.func.isRequired,
    fillMissingValuesDischarge: PropTypes.bool.isRequired,
    showFullForecastDischarge: PropTypes.bool.isRequired,
    multiStationsForecastDischarge: PropTypes.bool.isRequired,
    setFillMissingValuesDischarge: PropTypes.func.isRequired,
    setShowFullForecastDischarge: PropTypes.func.isRequired,
    setMultiStationsForecastDischarge: PropTypes.func.isRequired,
    fillMissingValuesSecondAxis: PropTypes.bool.isRequired,
    showFullForecastSecondAxis: PropTypes.bool.isRequired,
    multiStationsForecastSecondAxis: PropTypes.bool.isRequired,
    setFillMissingValuesSecondAxis: PropTypes.func.isRequired,
    setShowFullForecastSecondAxis: PropTypes.func.isRequired,
    setMultiStationsForecastSecondAxis: PropTypes.func.isRequired,
    forecastEflowsVariable: PropTypes.oneOf(['Q', 'TW', 'WL']).isRequired,
    setForecastEflowsVariable: PropTypes.func.isRequired,
    forecastSecondAxisVariable: PropTypes.oneOf(['Q', 'TW', 'WL']).isRequired,
    setForecastSecondAxisVariable: PropTypes.func.isRequired,
    meanLowFlowMethod: PropTypes.oneOf([
        'TNT30',
        'TNT20',
        'EXCEED95',
        'EXCEED75',
    ]).isRequired,
    onSetMeanLowFlowMethod: PropTypes.func.isRequired,
    meanLowFlowMethodFrequency: PropTypes.oneOf([
        'LONG-TERM',
        'SEASONAL',
        'BIOPERIOD',
        'MONTHLY',
    ]).isRequired,
    onSetMeanLowFlowMethodFrequency: PropTypes.func.isRequired,
    multiplyByFishCoefficients: PropTypes.bool.isRequired,
    onSetMultiplyByFishCoefficients: PropTypes.func.isRequired,
    onRunEstimation: PropTypes.func.isRequired,
    watershed: PropTypes.number.isRequired,
    enableForecasting: PropTypes.bool.isRequired,
    setEnableForecasting: PropTypes.func.isRequired,
};

Configuration.defaultProps = {
    startDate: null,
    endDate: null,
    fets: [],
};
