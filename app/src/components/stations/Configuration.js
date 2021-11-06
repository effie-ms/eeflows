import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Card, Elevation, Divider, Button } from '@blueprintjs/core';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { gettext } from 'utils/text';
import { LowFlowTabPane } from 'components/stations/configuration/LowFlowTabPane';
import { MeasurementsConfiguration } from 'components/stations/configuration/MeasurementsConfiguration';

export const Configuration = ({
    startDate,
    endDate,
    onSetDateRange,
    secondAxisTimeSeriesType,
    onSetSecondAxisTimeSeriesType,
    secondAxisThreshold,
    onSetSecondAxisThreshold,
    meanLowFlowMethod,
    onSetMeanLowFlowMethod,
    meanLowFlowMethodFrequency,
    onSetMeanLowFlowMethodFrequency,
    onRunEstimation,
}) => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab) => {
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
                        <NavItem>
                            <NavLink
                                className={classnames({
                                    active: activeTab === '2',
                                })}
                                onClick={() => {
                                    toggle('2');
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
                            />
                        </TabPane>
                        <TabPane tabId="2">
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
                            large
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
    secondAxisTimeSeriesType: PropTypes.oneOf(['TW', 'WL']).isRequired,
    onSetSecondAxisTimeSeriesType: PropTypes.func.isRequired,
    secondAxisThreshold: PropTypes.number.isRequired,
    onSetSecondAxisThreshold: PropTypes.func.isRequired,
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
    onRunEstimation: PropTypes.func.isRequired,
};

Configuration.defaultProps = {
    startDate: null,
    endDate: null,
};
