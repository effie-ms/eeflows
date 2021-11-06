/* eslint-disable no-param-reassign */
import { put, takeLatest } from 'redux-saga/effects';

import { receiveEflows, setServerErrorEflows } from 'ducks/station';
import { formatDate } from 'utils/dates';
import api from 'services/api';

const FETCH_EFLOWS_ACTION_TYPE = 'FETCH_EFLOWS';
export const fetchEflowsAction = (
    stationId,
    from,
    to,
    secondAxisType,
    meanLowFlowMethod,
    meanLowFlowMethodFrequency,
) => ({
    type: FETCH_EFLOWS_ACTION_TYPE,
    stationId,
    from,
    to,
    secondAxisType,
    meanLowFlowMethod,
    meanLowFlowMethodFrequency,
});

function* fetchEflows({
    stationId,
    from,
    to,
    secondAxisType,
    meanLowFlowMethod,
    meanLowFlowMethodFrequency,
}) {
    try {
        const fromTime = formatDate(from, false);
        const toTime = formatDate(to, false);

        const eflows = yield api.station.eflows.fetch({
            pk: stationId,
            fromTime,
            toTime,
            secondAxisType,
            meanLowFlowMethod,
            meanLowFlowMethodFrequency,
        });
        const parsedEflows = JSON.parse(eflows.replace(/\bNaN\b/g, 'null'));
        parsedEflows.eflows_ts.forEach((part, index, arr) => {
            arr[index].discharge_range = [
                arr[index].min_discharge,
                arr[index].max_discharge,
            ];
            arr[index].low_eflows_level_range = [
                arr[index].min_low_eflow_level,
                arr[index].max_low_eflow_level,
            ];
        });
        parsedEflows.eflows_ts.forEach((part, index, arr) => {
            arr[index].second_axis_ts_range = [
                arr[index].min_second_axis_ts,
                arr[index].max_second_axis_ts,
            ];
        });

        yield put(receiveEflows(parsedEflows));
    } catch (err) {
        yield put(setServerErrorEflows(`Something went wrong: ${err}`));
        console.error(err);
    }
}

export const fetchEflowsInitialWorker = ({ params }) => {
    fetchEflowsAction(
        params.stationId,
        params.from,
        params.to,
        params.secondAxisType,
        params.meanLowFlowMethod,
        params.meanLowFlowMethodFrequency,
    );
};

export default function* fetchEflowsWatcher() {
    yield takeLatest(FETCH_EFLOWS_ACTION_TYPE, fetchEflows);
}
