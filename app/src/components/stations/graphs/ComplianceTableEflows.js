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

const getExportDataComplianceTableEflowsLow = eflowsTS => ({
    winterLowObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'LOW',
        false,
    ),
    springLowObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'LOW',
        false,
    ),
    summerLowObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'LOW',
        false,
    ),
    autumnLowObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'LOW',
        false,
    ),
    winterLowForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'LOW',
        true,
    ),
    springLowForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'LOW',
        true,
    ),
    summerLowForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'LOW',
        true,
    ),
    autumnLowForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'LOW',
        true,
    ),
});

const getExportDataComplianceTableEflowsRAELFF = eflowsTS => ({
    winterBaseObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'BASE',
        false,
    ),
    winterBaseForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'BASE',
        true,
    ),
    winterSubsistenceObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'SUBSISTENCE',
        false,
    ),
    winterSubsistenceForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'SUBSISTENCE',
        true,
    ),
    winterCriticalObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'CRITICAL',
        false,
    ),
    winterCriticalForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'OW',
        'CRITICAL',
        true,
    ),
    springBaseObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'BASE',
        false,
    ),
    springBaseForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'BASE',
        true,
    ),
    springSubsistenceObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'SUBSISTENCE',
        false,
    ),
    springSubsistenceForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'SUBSISTENCE',
        true,
    ),
    springCriticalObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'CRITICAL',
        false,
    ),
    springCriticalForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'SS',
        'CRITICAL',
        true,
    ),

    summerBaseObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'BASE',
        false,
    ),
    summerBaseForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'BASE',
        true,
    ),
    summerSubsistenceObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'SUBSISTENCE',
        false,
    ),
    summerSubsistenceForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'SUBSISTENCE',
        true,
    ),
    summerCriticalObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'CRITICAL',
        false,
    ),
    summerCriticalForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'RG',
        'CRITICAL',
        true,
    ),

    autumnBaseObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'BASE',
        false,
    ),
    autumnBaseForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'BASE',
        true,
    ),
    autumnSubsistenceObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'SUBSISTENCE',
        false,
    ),
    autumnSubsistenceForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'SUBSISTENCE',
        true,
    ),
    autumnCriticalObserved: getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'CRITICAL',
        false,
    ),
    autumnCriticalForecast: getCompliancePercentagesEflow(
        eflowsTS,
        'FS',
        'CRITICAL',
        true,
    ),
});

const ComplianceTableEflowsLow = ({ eflowsTS, enableForecasting }) => {
    const data = getExportDataComplianceTableEflowsLow(eflowsTS);

    return (
        <Table bordered striped className="mt-4 fish-coefficients-table">
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
                    <th scope="row">{gettext('Compliant: Observations')}</th>
                    <td>
                        <p>{gettext('Low')}</p>
                    </td>
                    <td>
                        <p>{data.springLowObserved.compliant}</p>
                    </td>
                    <td>
                        <p>{data.summerLowObserved.compliant}</p>
                    </td>
                    <td>
                        <p>{data.autumnLowObserved.compliant}</p>
                    </td>
                    <td>
                        <p>{data.winterLowObserved.compliant}</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">{gettext('Noncompliant: Observations')}</th>
                    <td>
                        <p>{gettext('Low')}</p>
                    </td>
                    <td>
                        <p>{data.springLowObserved.noncompliant}</p>
                    </td>
                    <td>
                        <p>{data.summerLowObserved.noncompliant}</p>
                    </td>
                    <td>
                        <p>{data.autumnLowObserved.noncompliant}</p>
                    </td>
                    <td>
                        <p>{data.winterLowObserved.noncompliant}</p>
                    </td>
                </tr>
                {enableForecasting && (
                    <tr>
                        <th scope="row">{gettext('Compliant: Predictions')}</th>
                        <td>
                            <p>{gettext('Low')}</p>
                        </td>
                        <td>
                            <p>{data.springLowForecast.compliant}</p>
                        </td>
                        <td>
                            <p>{data.summerLowForecast.compliant}</p>
                        </td>
                        <td>
                            <p>{data.autumnLowForecast.compliant}</p>
                        </td>
                        <td>
                            <p>{data.winterLowForecast.compliant}</p>
                        </td>
                    </tr>
                )}
                {enableForecasting && (
                    <tr>
                        <th scope="row">
                            {gettext('Noncompliant: Predictions')}
                        </th>
                        <td>
                            <p>{gettext('Low')}</p>
                        </td>
                        <td>
                            <p>{data.springLowForecast.noncompliant}</p>
                        </td>
                        <td>
                            <p>{data.summerLowForecast.noncompliant}</p>
                        </td>
                        <td>
                            <p>{data.autumnLowForecast.noncompliant}</p>
                        </td>
                        <td>
                            <p>{data.winterLowForecast.noncompliant}</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};
ComplianceTableEflowsLow.propTypes = {
    eflowsTS: PropTypes.arrayOf(EflowsShape),
    enableForecasting: PropTypes.bool.isRequired,
};
ComplianceTableEflowsLow.defaultProps = {
    eflowsTS: [],
};

const ComplianceTableEflowsRAELFF = ({ eflowsTS, enableForecasting }) => {
    const data = getExportDataComplianceTableEflowsRAELFF(eflowsTS);

    return (
        <Table bordered striped className="mt-4 fish-coefficients-table">
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
                    <th scope="row">{gettext('Compliant: Observations')}</th>
                    <td>
                        <p>{gettext('Base')}</p>
                        <p>{gettext('Critical')}</p>
                        <p>{gettext('Subsistence')}</p>
                    </td>
                    <td>
                        <p>{data.springBaseObserved.compliant}</p>
                        <p>{data.springCriticalObserved.compliant}</p>
                        <p>{data.springSubsistenceObserved.compliant}</p>
                    </td>
                    <td>
                        <p>{data.summerBaseObserved.compliant}</p>
                        <p>{data.summerCriticalObserved.compliant}</p>
                        <p>{data.summerSubsistenceObserved.compliant}</p>
                    </td>
                    <td>
                        <p>{data.autumnBaseObserved.compliant}</p>
                        <p>{data.autumnCriticalObserved.compliant}</p>
                        <p>{data.autumnSubsistenceObserved.compliant}</p>
                    </td>
                    <td>
                        <p>{data.winterBaseObserved.compliant}</p>
                        <p>{data.winterCriticalObserved.compliant}</p>
                        <p>{data.winterSubsistenceObserved.compliant}</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">{gettext('Noncompliant: Observations')}</th>
                    <td>
                        <p>{gettext('Base')}</p>
                        <p>{gettext('Critical')}</p>
                        <p>{gettext('Subsistence')}</p>
                    </td>
                    <td>
                        <p>{data.springBaseObserved.noncompliant}</p>
                        <p>{data.springCriticalObserved.noncompliant}</p>
                        <p>{data.springSubsistenceObserved.noncompliant}</p>
                    </td>
                    <td>
                        <p>{data.summerBaseObserved.noncompliant}</p>
                        <p>{data.summerCriticalObserved.noncompliant}</p>
                        <p>{data.summerSubsistenceObserved.noncompliant}</p>
                    </td>
                    <td>
                        <p>{data.autumnBaseObserved.noncompliant}</p>
                        <p>{data.autumnCriticalObserved.noncompliant}</p>
                        <p>{data.autumnSubsistenceObserved.noncompliant}</p>
                    </td>
                    <td>
                        <p>{data.winterBaseObserved.noncompliant}</p>
                        <p>{data.winterCriticalObserved.noncompliant}</p>
                        <p>{data.winterSubsistenceObserved.noncompliant}</p>
                    </td>
                </tr>
                {enableForecasting && (
                    <tr>
                        <th scope="row">{gettext('Compliant: Predictions')}</th>
                        <td>
                            <p>{gettext('Base')}</p>
                            <p>{gettext('Critical')}</p>
                            <p>{gettext('Subsistence')}</p>
                        </td>
                        <td>
                            <p>{data.springBaseForecast.compliant}</p>
                            <p>{data.springCriticalForecast.compliant}</p>
                            <p>{data.springSubsistenceForecast.compliant}</p>
                        </td>
                        <td>
                            <p>{data.summerBaseForecast.compliant}</p>
                            <p>{data.summerCriticalForecast.compliant}</p>
                            <p>{data.summerSubsistenceForecast.compliant}</p>
                        </td>
                        <td>
                            <p>{data.autumnBaseForecast.compliant}</p>
                            <p>{data.autumnCriticalForecast.compliant}</p>
                            <p>{data.autumnSubsistenceForecast.compliant}</p>
                        </td>
                        <td>
                            <p>{data.winterBaseForecast.compliant}</p>
                            <p>{data.winterCriticalForecast.compliant}</p>
                            <p>{data.winterSubsistenceForecast.compliant}</p>
                        </td>
                    </tr>
                )}
                {enableForecasting && (
                    <tr>
                        <th scope="row">
                            {gettext('Noncompliant: Predictions')}
                        </th>
                        <td>
                            <p>{gettext('Base')}</p>
                            <p>{gettext('Critical')}</p>
                            <p>{gettext('Subsistence')}</p>
                        </td>
                        <td>
                            <p>{data.springBaseForecast.noncompliant}</p>
                            <p>{data.springCriticalForecast.noncompliant}</p>
                            <p>{data.springSubsistenceForecast.noncompliant}</p>
                        </td>
                        <td>
                            <p>{data.summerBaseForecast.noncompliant}</p>
                            <p>{data.summerCriticalForecast.noncompliant}</p>
                            <p>{data.summerSubsistenceForecast.noncompliant}</p>
                        </td>
                        <td>
                            <p>{data.autumnBaseForecast.noncompliant}</p>
                            <p>{data.autumnCriticalForecast.noncompliant}</p>
                            <p>{data.autumnSubsistenceForecast.noncompliant}</p>
                        </td>
                        <td>
                            <p>{data.winterBaseForecast.noncompliant}</p>
                            <p>{data.winterCriticalForecast.noncompliant}</p>
                            <p>{data.winterSubsistenceForecast.noncompliant}</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};
ComplianceTableEflowsRAELFF.propTypes = {
    eflowsTS: PropTypes.arrayOf(EflowsShape),
    enableForecasting: PropTypes.bool.isRequired,
};
ComplianceTableEflowsRAELFF.defaultProps = {
    eflowsTS: [],
};

export const ComplianceTableEflows = ({
    eflowsTS,
    stationName,
    startDate,
    endDate,
    showProcessingBar,
    enableForecasting,
    meanLowFlowMethod,
}) => {
    const summaryName = `${getTimeSeriesNameByAbbreviation(
        'EF',
    )} compliance percentages`;

    const exportData =
        meanLowFlowMethod !== 'RAELFF'
            ? getExportDataComplianceTableEflowsLow(eflowsTS)
            : getExportDataComplianceTableEflowsRAELFF(eflowsTS);

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
                            exportData,
                            'EF',
                            enableForecasting,
                            stationName,
                            startDate,
                            endDate,
                            meanLowFlowMethod,
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
                    {meanLowFlowMethod !== 'RAELFF' ? (
                        <ComplianceTableEflowsLow
                            eflowsTS={eflowsTS}
                            enableForecasting={enableForecasting}
                        />
                    ) : (
                        <ComplianceTableEflowsRAELFF
                            eflowsTS={eflowsTS}
                            enableForecasting={enableForecasting}
                        />
                    )}
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
    enableForecasting: PropTypes.bool.isRequired,
    meanLowFlowMethod: PropTypes.oneOf([
        'TNT30',
        'TNT20',
        'EXCEED95',
        'EXCEED75',
        'RAELFF',
    ]).isRequired,
};

ComplianceTableEflows.defaultProps = {
    eflowsTS: [],
};
