import React from 'react';

export const upperCaseFirst = (str) =>
    `${str.charAt(0).toUpperCase()}${str.substr(1).toLowerCase()}`;

export const nl2br = (text) => {
    const res = [];
    text.split('\n').forEach((x, i) => {
        if (i !== 0) {
            res.push(<br key={`br-${i}`} />); // eslint-disable-line react/no-array-index-key
        }

        res.push(x);
    });

    return res;
};

export const tNoop = (key) => key;

export function gettext(text) {
    return text;
}

export function getTimeSeriesNameByAbbreviation(tsAbbr) {
    switch (tsAbbr) {
        case 'TW': {
            return 'Water temperature';
        }
        case 'WL': {
            return 'Water level';
        }
        case 'EF': {
            return 'Environmental flow';
        }
        case 'Q':
            return 'Discharge';
        default:
            return '';
    }
}

export function getTimeSeriesUnitsByAbbreviation(tsAbbr) {
    switch (tsAbbr) {
        case 'TW': {
            return '°C';
        }
        case 'WL': {
            return 'cm';
        }
        case 'EF': {
            return 'm3/s';
        }
        default:
            return '';
    }
}

export function getShortBioperiodName(longBioperiodName) {
    switch (longBioperiodName) {
        case 'Fall Spawning': {
            return 'FS';
        }
        case 'Overwintering': {
            return 'OW';
        }
        case 'Rearing and Growth': {
            return 'RG';
        }
        case 'Spring Spawning': {
            return 'SS';
        }
        default: {
            return '';
        }
    }
}

export function getBioperiodBoundaryShortName(longName) {
    const parts = longName.split('/');
    if (parts.length === 2) {
        return `${getShortBioperiodName(parts[0])}/${getShortBioperiodName(
            parts[1],
        )}`;
    }
    return longName;
}
