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

export const Configuration = ({
    startDate,
    endDate,
    onSetDateRange,
    catchmentArea,
    onSetCatchmentArea,
    areaFactor,
    onSetAreaFactor,
    fets,
    selectedFETId,
    onSetSelectedFETId,
    secondAxisTimeSeriesType,
    onSetSecondAxisTimeSeriesType,
    secondAxisThreshold,
    onSetSecondAxisThreshold,
    meanLowFlowMethod,
    onSetMeanLowFlowMethod,
    meanLowFlowMethodFrequency,
    onSetMeanLowFlowMethodFrequency,
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
                                {gettext('Environmental flow estimation')}
                            </NavLink>
                        </NavItem>
                        <Divider />
                        {meanLowFlowMethod === 'RAELFF' && (
                            <>
                                <NavItem>
                                    <NavLink
                                        className={classnames({
                                            active: activeTab === '2',
                                        })}
                                        onClick={() => {
                                            toggle('2');
                                        }}
                                    >
                                        {gettext(
                                            'Regionally Applicable Env. Low Flow Formula',
                                        )}
                                    </NavLink>
                                </NavItem>
                                <Divider />
                            </>
                        )}
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
                                enableForecasting={enableForecasting}
                                setEnableForecasting={setEnableForecasting}
                            />
                        </TabPane>
                        <TabPane tabId="2">
                            <FETConfiguration
                                fets={fets}
                                selectedFETId={selectedFETId}
                                onSetSelectedFETId={onSetSelectedFETId}
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
    fets: PropTypes.arrayOf(FETInfoShape),
    selectedFETId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    onSetSelectedFETId: PropTypes.func.isRequired,
    secondAxisTimeSeriesType: PropTypes.oneOf(['TW', 'WL']).isRequired,
    onSetSecondAxisTimeSeriesType: PropTypes.func.isRequired,
    secondAxisThreshold: PropTypes.number.isRequired,
    onSetSecondAxisThreshold: PropTypes.func.isRequired,
    meanLowFlowMethod: PropTypes.oneOf([
        'TNT30',
        'TNT20',
        'EXCEED95',
        'EXCEED75',
        'RAELFF',
    ]).isRequired,
    onSetMeanLowFlowMethod: PropTypes.func.isRequired,
    meanLowFlowMethodFrequency: PropTypes.oneOf([
        'LONG-TERM',
        'SEASONAL',
        'BIOPERIOD',
        'MONTHLY',
    ]).isRequired,
    onSetMeanLowFlowMethodFrequency: PropTypes.func.isRequired,
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
