import domtoimage from 'dom-to-image';
import fileDownload from 'js-file-download';

export const downloadAsPNG = (contentType, stationName, startDate, endDate) => {
    let fileName;
    let nodeId;
    if (contentType === 'compliance') {
        fileName = `${stationName}-${contentType}-${startDate}-${endDate}`;
        nodeId = 'compliance-graph';
    } else {
        fileName = `${stationName}-${contentType}-${startDate}-${endDate}`;
        if (contentType === 'UCUT-EF') {
            nodeId = 'ucut-eflows';
        } else if (contentType === 'UCUT-TW' || contentType === 'UCUT-WL') {
            nodeId = 'ucut-second-axis';
        } else if (contentType === 'CT-EF') {
            nodeId = 'ct-eflows';
        } else {
            nodeId = 'ct-second-axis';
        }
    }
    if (fileName && nodeId) {
        domtoimage
            .toBlob(document.getElementById(nodeId), { bgcolor: 'white' })
            .then(function(blob) {
                fileDownload(blob, `${fileName}.png`);
            });
    }
};
