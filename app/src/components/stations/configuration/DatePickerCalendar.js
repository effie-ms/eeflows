import React from 'react';
import PropTypes from 'prop-types';

import { Classes, Icon, Intent, Tag } from '@blueprintjs/core';
import { DateRangePicker } from '@blueprintjs/datetime';

import { gettext } from 'utils/text';
import { formatDate2 } from 'utils/dates';

const minDate = new Date(2009, 0, 1); // 01.01.2009
const maxDate = new Date(2018, 11, 31); // 31.12.2018

export const DatePickerCalendar = ({
    startDate,
    endDate,
    onSetDateRange,
    setYear,
}) => {
    const onSelectDateInCalendar = dates => {
        setYear('custom');
        onSetDateRange(dates);
    };

    return (
        <div className="calendar">
            <h5>{gettext('or select a custom date range')}:</h5>
            <DateRangePicker
                value={[startDate, endDate]}
                className={Classes.ELEVATION_1}
                maxDate={maxDate}
                minDate={minDate}
                shortcuts={false}
                contiguousCalendarMonths={false}
                onChange={_dateRange => onSelectDateInCalendar(_dateRange)}
            />
            <div className="d-flex flex-row w-100 my-3 align-items-center">
                <div>
                    <h5 className="mb-0 mr-3">{gettext('Selected dates')}</h5>
                    <h5 className="mb-0 mr-3">(DD-MM-YYYY):</h5>
                </div>
                <Tag intent={Intent.PRIMARY}>
                    {startDate !== null ? (
                        <span>{formatDate2(startDate.toDateString())}</span>
                    ) : (
                        <span>{gettext('No date')}</span>
                    )}
                </Tag>
                <Icon className="mx-2" icon="arrow-right" />
                <Tag intent={Intent.PRIMARY}>
                    {endDate !== null ? (
                        <span>{formatDate2(endDate.toDateString())}</span>
                    ) : (
                        <span>{gettext('No date')}</span>
                    )}
                </Tag>
            </div>
        </div>
    );
};

DatePickerCalendar.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    onSetDateRange: PropTypes.func.isRequired,
    setYear: PropTypes.func.isRequired,
};

DatePickerCalendar.defaultProps = {
    startDate: null,
    endDate: null,
};
