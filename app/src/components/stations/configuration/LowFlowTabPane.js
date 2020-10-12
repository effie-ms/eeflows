import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'reactstrap';
import { Switch } from '@blueprintjs/core';

import { DatePickerCalendar } from 'components/stations/configuration/DatePickerCalendar';
import { CatchmentAreaConfiguration } from 'components/stations/configuration/CatchmentAreaConfiguration';
import { gettext } from 'utils/text';

const yearsOptions = Array.from({ length: 2018 - 2009 + 1 }, (_, i) =>
    (2009 + i).toString(),
);

export const LowFlowTabPane = ({
    startDate,
    endDate,
    onSetDateRange,
    catchmentArea,
    onSetCatchmentArea,
    areaFactor,
    onSetAreaFactor,
    meanLowFlowMethod,
    onSetMeanLowFlowMethod,
    meanLowFlowMethodFrequency,
    onSetMeanLowFlowMethodFrequency,
    watershed,
    enableForecasting,
    setEnableForecasting,
}) => {
    const [year, setYear] = useState('2016');

    useEffect(() => {
        if (year !== 'custom') {
            onSetDateRange([
                new Date(parseInt(year, 0), 0, 1),
                new Date(parseInt(year, 0), 11, 31),
            ]);
        }
    }, [year]);

    return (
        <div className="d-flex flex-row mt-3">
            <div className="m-3">
                <div className="measurement-configuration mt-3 d-flex align-items-center">
                    <h5>{gettext('Select a year:')}</h5>
                    <Input
                        type="select"
                        name="year"
                        id="year"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                    >
                        {yearsOptions.map((item, i) => (
                            <option key={i.toString()} value={item}>
                                {gettext(item)}
                            </option>
                        ))}
                        <option value="custom">{gettext('Custom')}</option>
                    </Input>
                </div>
                <DatePickerCalendar
                    startDate={startDate}
                    endDate={endDate}
                    onSetDateRange={onSetDateRange}
                    setYear={setYear}
                />
            </div>
            <div className="m-3 d-flex flex-row">
                <div style={{ flexBasis: '50%' }}>
                    <div className="second-axis-selector mt-3">
                        <h5>
                            {gettext(
                                `Select an environmental flow calculation method`,
                            )}
                            :
                        </h5>
                        <Input
                            type="select"
                            name="selectMeanLowFlowMethod"
                            id="selectMeanLowFlowMethod"
                            value={meanLowFlowMethod}
                            onChange={e =>
                                onSetMeanLowFlowMethod(e.target.value)
                            }
                        >
                            <option value="TNT30">
                                {gettext('Tennant 30% mean')}
                            </option>
                            <option value="TNT20">
                                {gettext('Tennant 20% mean')}
                            </option>
                            <option value="EXCEED95">
                                {gettext(
                                    'Low flow with 95% exceedance probability',
                                )}
                            </option>
                            <option value="EXCEED75">
                                {gettext(
                                    'Low flow with 75% exceedance probability',
                                )}
                            </option>
                            <option value="RAELFF">
                                {gettext(
                                    'Regionally Applicable Env. Low Flow Formula',
                                )}
                            </option>
                        </Input>
                    </div>
                    <div className="second-axis-selector d-flex flex-column mt-3">
                        <h5>
                            {gettext(
                                `Select an environmental flow calculation frequency`,
                            )}
                            :
                        </h5>
                        <Input
                            type="select"
                            name="selectMeanLowFlowMethodFrequency"
                            id="selectMeanLowFlowMethodFrequency"
                            value={meanLowFlowMethodFrequency}
                            onChange={e =>
                                onSetMeanLowFlowMethodFrequency(e.target.value)
                            }
                        >
                            <option value="LONG-TERM">
                                {gettext('Long-term (all data)')}
                            </option>
                            <option value="SEASONAL">
                                {gettext('Seasonal (summer/winter)')}
                            </option>
                            <option value="BIOPERIOD">
                                {gettext('Bioperiodical')}
                            </option>
                            <option value="MONTHLY">
                                {gettext('Monthly')}
                            </option>
                        </Input>
                        <Switch
                            className="mt-3"
                            style={{ fontSize: '1.0rem' }}
                            labelElement={gettext('Enable forecasting')}
                            innerLabelChecked="yes"
                            innerLabel="no"
                            checked={enableForecasting}
                            onChange={() =>
                                setEnableForecasting(!enableForecasting)
                            }
                        />
                    </div>
                </div>
                <div style={{ flexBasis: '50%' }}>
                    <CatchmentAreaConfiguration
                        catchmentArea={catchmentArea}
                        onSetCatchmentArea={onSetCatchmentArea}
                        areaFactor={areaFactor}
                        onSetAreaFactor={onSetAreaFactor}
                        watershed={watershed}
                    />
                </div>
            </div>
        </div>
    );
};

LowFlowTabPane.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    onSetDateRange: PropTypes.func.isRequired,
    catchmentArea: PropTypes.number.isRequired,
    onSetCatchmentArea: PropTypes.func.isRequired,
    areaFactor: PropTypes.number.isRequired,
    onSetAreaFactor: PropTypes.func.isRequired,
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
    watershed: PropTypes.number.isRequired,
    enableForecasting: PropTypes.bool.isRequired,
    setEnableForecasting: PropTypes.func.isRequired,
};

LowFlowTabPane.defaultProps = {
    startDate: null,
    endDate: null,
};
