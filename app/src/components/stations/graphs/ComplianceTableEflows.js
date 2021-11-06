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

const getExportDataComplianceTableEflowsLow = (eflowsTS) => ({
    winterLowObserved: getCompliancePercentagesEflow(eflowsTS, 'OW'),
    springLowObserved: getCompliancePercentagesEflow(eflowsTS, 'SS'),
    summerLowObserved: getCompliancePercentagesEflow(eflowsTS, 'RG'),
    autumnLowObserved: getCompliancePercentagesEflow(eflowsTS, 'FS'),
});

const ComplianceTableEflowsLow = ({ eflowsTS }) => {
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
            </tbody>
        </Table>
    );
};
ComplianceTableEflowsLow.propTypes = {
    eflowsTS: PropTypes.arrayOf(EflowsShape),
};
ComplianceTableEflowsLow.defaultProps = {
    eflowsTS: [],
};

export const ComplianceTableEflows = ({
    eflowsTS,
    stationName,
    startDate,
    endDate,
    showProcessingBar,
}) => {
    const summaryName = `${getTimeSeriesNameByAbbreviation(
        'EF',
    )} compliance percentages`;

    const exportData = getExportDataComplianceTableEflowsLow(eflowsTS);

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
                    <ComplianceTableEflowsLow eflowsTS={eflowsTS} />
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
};

ComplianceTableEflows.defaultProps = {
    eflowsTS: [],
};
