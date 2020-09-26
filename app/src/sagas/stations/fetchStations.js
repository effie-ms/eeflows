import { put } from 'redux-saga/effects';

import api from 'services/api';
import { receiveStations } from 'ducks/station';

export function* fetchStations() {
    try {
        const stations = yield api.station.list.fetch();
        yield put(receiveStations(stations));
    } catch (err) {
        console.error('Something went wrong (stations and fets fetching):');
        console.error(err);
    }
}
