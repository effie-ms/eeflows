import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'reactstrap';

import { gettext, getTimeSeriesNameByAbbreviation } from 'utils/text';
import { EflowsShape } from 'utils/types';
import { downloadAsPNG } from 'utils/export/graph_png';
import { downloadAsExcelComplianceSummaries } from 'utils/export/data_to_excel';
import { getCompliancePercentagesEflow } from 'utils/complianceSummaries';

import { ProcessingState } from 'components/stations/shared/ProcessingState';
import { ExportDropdown } from 'components/stations/shared/ExportDropdown';

export const ComplianceTableEflows = ({
    eflowsTS,
    stationName,
    startDate,
    endDate,
    showProcessingBar,
    forecastingEnabled,
}) => {
    // Overwintering compliance
    const winterLowObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'LOW',
        false,
    );
    const winterLowForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'LOW',
        true,
    );
    const winterBaseObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'BASE',
        false,
    );
    const winterBaseForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'BASE',
        true,
    );
    const winterSubsistenceObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'SUBSISTENCE',
        false,
    );
    const winterSubsistenceForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'SUBSISTENCE',
        true,
    );
    const winterCriticalObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'CRITICAL',
        false,
    );
    const winterCriticalForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'CRITICAL',
        true,
    );

    // Spring Spawning compliance
    const springLowObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'LOW',
        false,
    );
    const springLowForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'LOW',
        true,
    );
    const springBaseObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'BASE',
        false,
    );
    const springBaseForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'BASE',
        true,
    );
    const springSubsistenceObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'SUBSISTENCE',
        false,
    );
    const springSubsistenceForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'SUBSISTENCE',
        true,
    );
    const springCriticalObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'CRITICAL',
        false,
    );
    const springCriticalForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'CRITICAL',
        true,
    );

    // Rearing and Growth compliance
    const summerLowObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'LOW',
        false,
    );
    const summerLowForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'LOW',
        true,
    );
    const summerBaseObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'BASE',
        false,
    );
    const summerBaseForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'BASE',
        true,
    );
    const summerSubsistenceObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'SUBSISTENCE',
        false,
    );
    const summerSubsistenceForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'SUBSISTENCE',
        true,
    );
    const summerCriticalObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'CRITICAL',
        false,
    );
    const summerCriticalForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'CRITICAL',
        true,
    );

    // Fall Spawning compliance
    const autumnLowObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'LOW',
        false,
    );
    const autumnLowForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'LOW',
        true,
    );
    const autumnBaseObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'BASE',
        false,
    );
    const autumnBaseForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'BASE',
        true,
    );
    const autumnSubsistenceObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'SUBSISTENCE',
        false,
    );
    const autumnSubsistenceForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'SUBSISTENCE',
        true,
    );
    const autumnCriticalObserved = getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'CRITICAL',
        false,
    );
    const autumnCriticalForecast = getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'CRITICAL',
        true,
    );

    const getExportableData = () => ({
        winterLowObserved,
        winterLowForecast,
        winterBaseObserved,
        winterBaseForecast,
        winterSubsistenceObserved,
        winterSubsistenceForecast,
        winterCriticalObserved,
        winterCriticalForecast,
        springLowObserved,
        springLowForecast,
        springBaseObserved,
        springBaseForecast,
        springSubsistenceObserved,
        springSubsistenceForecast,
        springCriticalObserved,
        springCriticalForecast,
        summerLowObserved,
        summerLowForecast,
        summerBaseObserved,
        summerBaseForecast,
        summerSubsistenceObserved,
        summerSubsistenceForecast,
        summerCriticalObserved,
        summerCriticalForecast,
        autumnLowObserved,
        autumnLowForecast,
        autumnBaseObserved,
        autumnBaseForecast,
        autumnSubsistenceObserved,
        autumnSubsistenceForecast,
        autumnCriticalObserved,
        autumnCriticalForecast,
    });

    const summaryName = `${getTimeSeriesNameByAbbreviation(
        'EF',
    )} compliance percentages`;

    return (
        <div
            className="graph-container"
            style={{
                flexBasis: '50%',
                minWidth: '750px',
                paddingLeft: '50px',
            }}
        >
            <div className="d-flex align-items-center justify-content-between">
                <h4>
                    {gettext(
                        `Compliance summary:
                        ${getTimeSeriesNameByAbbreviation('EF')}`,
                    )}
                </h4>
                <ExportDropdown
                    disabled={showProcessingBar}
                    onDownloadExcel={() =>
                        downloadAsExcelComplianceSummaries(
                            getExportableData(),
                            'EF',
                            stationName,
                            startDate,
                            endDate,
                        )
                    }
                    onDownloadImage={() =>
                        downloadAsPNG('CT-EF', stationName, startDate, endDate)
                    }
                />
            </div>
            {showProcessingBar ? (
                <ProcessingState />
            ) : (
                <div id="ct-eflows">
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>
                        {gettext(
                            `${stationName}: ${summaryName} (${startDate}-${endDate})`,
                        )}
                    </p>
                    <Table
                        bordered
                        striped
                        className="mt-4 fish-coefficients-table"
                    >
                        <thead>
                            <tr>
                                <th>{gettext('Compliance')}</th>
                                <th>{gettext('Threshold')}</th>
                                <th>{gettext('Spring Spawning')}</th>
                                <th>{gettext('Rearing and Growth')}</th>
                                <th>{gettext('Fall Spawning')}</th>
                                <th>{gettext('Overwintering')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">
                                    {gettext('Compliant: Observations')}
                                </th>
                                <td>
                                    <p>{gettext('Low')}</p>
                                    <p>{gettext('Base')}</p>
                                    <p>{gettext('Critical')}</p>
                                    <p>{gettext('Subsistence')}</p>
                                </td>
                                <td>
                                    <p>{springLowObserved.compliant}</p>
                                    <p>{springBaseObserved.compliant}</p>
                                    <p>{springCriticalObserved.compliant}</p>
                                    <p>{springSubsistenceObserved.compliant}</p>
                                </td>
                                <td>
                                    <p>{summerLowObserved.compliant}</p>
                                    <p>{summerBaseObserved.compliant}</p>
                                    <p>{summerCriticalObserved.compliant}</p>
                                    <p>{summerSubsistenceObserved.compliant}</p>
                                </td>
                                <td>
                                    <p>{autumnLowObserved.compliant}</p>
                                    <p>{autumnBaseObserved.compliant}</p>
                                    <p>{autumnCriticalObserved.compliant}</p>
                                    <p>{autumnSubsistenceObserved.compliant}</p>
                                </td>
                                <td>
                                    <p>{winterLowObserved.compliant}</p>
                                    <p>{winterBaseObserved.compliant}</p>
                                    <p>{winterCriticalObserved.compliant}</p>
                                    <p>{winterSubsistenceObserved.compliant}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    {gettext('Noncompliant: Observations')}
                                </th>
                                <td>
                                    <p>{gettext('Low')}</p>
                                    <p>{gettext('Base')}</p>
                                    <p>{gettext('Critical')}</p>
                                    <p>{gettext('Subsistence')}</p>
                                </td>
                                <td>
                                    <p>{springLowObserved.noncompliant}</p>
                                    <p>{springBaseObserved.noncompliant}</p>
                                    <p>{springCriticalObserved.noncompliant}</p>
                                    <p>
                                        {springSubsistenceObserved.noncompliant}
                                    </p>
                                </td>
                                <td>
                                    <p>{summerLowObserved.noncompliant}</p>
                                    <p>{summerBaseObserved.noncompliant}</p>
                                    <p>{summerCriticalObserved.noncompliant}</p>
                                    <p>
                                        {summerSubsistenceObserved.noncompliant}
                                    </p>
                                </td>
                                <td>
                                    <p>{autumnLowObserved.noncompliant}</p>
                                    <p>{autumnBaseObserved.noncompliant}</p>
                                    <p>{autumnCriticalObserved.noncompliant}</p>
                                    <p>
                                        {autumnSubsistenceObserved.noncompliant}
                                    </p>
                                </td>
                                <td>
                                    <p>{winterLowObserved.noncompliant}</p>
                                    <p>{winterBaseObserved.noncompliant}</p>
                                    <p>{winterCriticalObserved.noncompliant}</p>
                                    <p>
                                        {winterSubsistenceObserved.noncompliant}
                                    </p>
                                </td>
                            </tr>
                            {forecastingEnabled && (
                                <tr>
                                    <th scope="row">
                                        {gettext('Compliant: Predictions')}
                                    </th>
                                    <td>
                                        <p>{gettext('Low')}</p>
                                        <p>{gettext('Base')}</p>
                                        <p>{gettext('Critical')}</p>
                                        <p>{gettext('Subsistence')}</p>
                                    </td>
                                    <td>
                                        <p>{springLowForecast.compliant}</p>
                                        <p>{springBaseForecast.compliant}</p>
                                        <p>
                                            {springCriticalForecast.compliant}
                                        </p>
                                        <p>
                                            {
                                                springSubsistenceForecast.compliant
                                            }
                                        </p>
                                    </td>
                                    <td>
                                        <p>{summerLowForecast.compliant}</p>
                                        <p>{summerBaseForecast.compliant}</p>
                                        <p>
                                            {summerCriticalForecast.compliant}
                                        </p>
                                        <p>
                                            {
                                                summerSubsistenceForecast.compliant
                                            }
                                        </p>
                                    </td>
                                    <td>
                                        <p>{autumnLowForecast.compliant}</p>
                                        <p>{autumnBaseForecast.compliant}</p>
                                        <p>
                                            {autumnCriticalForecast.compliant}
                                        </p>
                                        <p>
                                            {
                                                autumnSubsistenceForecast.compliant
                                            }
                                        </p>
                                    </td>
                                    <td>
                                        <p>{winterLowForecast.compliant}</p>
                                        <p>{winterBaseForecast.compliant}</p>
                                        <p>
                                            {winterCriticalForecast.compliant}
                                        </p>
                                        <p>
                                            {
                                                winterSubsistenceForecast.compliant
                                            }
                                        </p>
                                    </td>
                                </tr>
                            )}
                            {forecastingEnabled && (
                                <tr>
                                    <th scope="row">
                                        {gettext('Noncompliant: Predictions')}
                                    </th>
                                    <td>
                                        <p>{gettext('Low')}</p>
                                        <p>{gettext('Base')}</p>
                                        <p>{gettext('Critical')}</p>
                                        <p>{gettext('Subsistence')}</p>
                                    </td>
                                    <td>
                                        <p>{springLowForecast.noncompliant}</p>
                                        <p>{springBaseForecast.noncompliant}</p>
                                        <p>
                                            {
                                                springCriticalForecast.noncompliant
                                            }
                                        </p>
                                        <p>
                                            {
                                                springSubsistenceForecast.noncompliant
                                            }
                                        </p>
                                    </td>
                                    <td>
                                        <p>{summerLowForecast.noncompliant}</p>
                                        <p>{summerBaseForecast.noncompliant}</p>
                                        <p>
                                            {
                                                summerCriticalForecast.noncompliant
                                            }
                                        </p>
                                        <p>
                                            {
                                                summerSubsistenceForecast.noncompliant
                                            }
                                        </p>
                                    </td>
                                    <td>
                                        <p>{autumnLowForecast.noncompliant}</p>
                                        <p>{autumnBaseForecast.noncompliant}</p>
                                        <p>
                                            {
                                                autumnCriticalForecast.noncompliant
                                            }
                                        </p>
                                        <p>
                                            {
                                                autumnSubsistenceForecast.noncompliant
                                            }
                                        </p>
                                    </td>
                                    <td>
                                        <p>{winterLowForecast.noncompliant}</p>
                                        <p>{winterBaseForecast.noncompliant}</p>
                                        <p>
                                            {
                                                winterCriticalForecast.noncompliant
                                            }
                                        </p>
                                        <p>
                                            {
                                                winterSubsistenceForecast.noncompliant
                                            }
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

ComplianceTableEflows.propTypes = {
    eflowsTS: PropTypes.arrayOf(EflowsShape),
    stationName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    showProcessingBar: PropTypes.bool.isRequired,
    forecastingEnabled: PropTypes.bool.isRequired,
};

ComplianceTableEflows.defaultProps = {
    eflowsTS: [],
};
