import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'reactstrap';

import { gettext, getTimeSeriesNameByAbbreviation } from 'utils/text';
import { EflowsShape } from 'utils/types';
import { downloadAsPNG } from 'utils/export/graph_png';
import { downloadAsExcelComplianceSummaries } from 'utils/export/data_to_excel';
import { getCompliancePercentagesSecondaryAxisTS } from 'utils/complianceSummaries';

import { ProcessingState } from 'components/stations/shared/ProcessingState';
import { ExportDropdown } from 'components/stations/shared/ExportDropdown';

export const ComplianceTableSecondAxis = ({
    eflowsTS,
    threshold,
    stationName,
    secondAxisTimeSeriesType,
    startDate,
    endDate,
    showProcessingBar,
}) => {
    const winterObserved = getCompliancePercentagesSecondaryAxisTS(
        eflowsTS,
        'OW',
        threshold,
    );
    const springObserved = getCompliancePercentagesSecondaryAxisTS(
        eflowsTS,
        'SS',
        threshold,
    );
    const summerObserved = getCompliancePercentagesSecondaryAxisTS(
        eflowsTS,
        'RG',
        threshold,
    );
    const autumnObserved = getCompliancePercentagesSecondaryAxisTS(
        eflowsTS,
        'FS',
        threshold,
    );

    const getExportableData = () => ({
        winterObserved,
        springObserved,
        summerObserved,
        autumnObserved,
    });

    const summaryName = `${getTimeSeriesNameByAbbreviation(
        secondAxisTimeSeriesType,
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
                        ${getTimeSeriesNameByAbbreviation(
                            secondAxisTimeSeriesType,
                        )}`,
                    )}
                </h4>
                <ExportDropdown
                    disabled={showProcessingBar}
                    onDownloadExcel={() =>
                        downloadAsExcelComplianceSummaries(
                            getExportableData(),
                            secondAxisTimeSeriesType,
                            stationName,
                            startDate,
                            endDate,
                        )
                    }
                    onDownloadImage={() =>
                        downloadAsPNG(
                            `CT-${secondAxisTimeSeriesType}`,
                            stationName,
                            startDate,
                            endDate,
                        )
                    }
                />
            </div>
            {showProcessingBar ? (
                <ProcessingState />
            ) : (
                <div id="ct-second-axis">
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
                                    <p>{springObserved.compliant}</p>
                                </td>
                                <td>
                                    <p>{summerObserved.compliant}</p>
                                </td>
                                <td>
                                    <p>{autumnObserved.compliant}</p>
                                </td>
                                <td>
                                    <p>{winterObserved.compliant}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    {gettext('Noncompliant: Observations')}
                                </th>
                                <td>
                                    <p>{springObserved.noncompliant}</p>
                                </td>
                                <td>
                                    <p>{summerObserved.noncompliant}</p>
                                </td>
                                <td>
                                    <p>{autumnObserved.noncompliant}</p>
                                </td>
                                <td>
                                    <p>{winterObserved.noncompliant}</p>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

ComplianceTableSecondAxis.propTypes = {
    eflowsTS: PropTypes.arrayOf(EflowsShape),
    threshold: PropTypes.number.isRequired,
    stationName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    secondAxisTimeSeriesType: PropTypes.oneOf(['WL', 'TW']).isRequired,
    showProcessingBar: PropTypes.bool.isRequired,
};

ComplianceTableSecondAxis.defaultProps = {
    eflowsTS: [],
};
