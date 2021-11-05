import { put } from 'redux-saga/effects';

import api from 'services/api';
import { receiveStations, setServerErrorStations } from 'ducks/station';

export function* fetchStations() {
    try {
        const stations = yield api.station.list.fetch();
        yield put(receiveStations(stations));
    } catch (err) {
        yield put(setServerErrorStations(`Something went wrong: ${err}`));
        console.error(err);
    }
}
