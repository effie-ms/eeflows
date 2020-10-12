/* eslint-disable no-param-reassign */
import { put, takeLatest } from 'redux-saga/effects';

import { receiveEflows } from 'ducks/station';
import { formatDate } from 'utils/dates';
import api from 'services/api';

const FETCH_EFLOWS_ACTION_TYPE = 'FETCH_EFLOWS';
export const fetchEflowsAction = (
    stationId,
    from,
    to,
    area,
    areaFactor,
    fetId,
    secondAxisType,
    meanLowFlowMethod,
    meanLowFlowMethodFrequency,
    enableForecasting,
) => ({
    type: FETCH_EFLOWS_ACTION_TYPE,
    stationId,
    from,
    to,
    area,
    areaFactor,
    fetId,
    secondAxisType,
    meanLowFlowMethod,
    meanLowFlowMethodFrequency,
    enableForecasting,
});

function* fetchEflows({
    stationId,
    from,
    to,
    area,
    areaFactor,
    fetId,
    secondAxisType,
    meanLowFlowMethod,
    meanLowFlowMethodFrequency,
    enableForecasting,
}) {
    try {
        const fromTime = formatDate(from);
        const toTime = formatDate(to);

        const eflows = yield api.station.eflows.fetch({
            pk: stationId,
            fromTime,
            toTime,
            area,
            areaFactor,
            fetId,
            secondAxisType,
            meanLowFlowMethod,
            meanLowFlowMethodFrequency,
            enableForecasting,
        });
        const parsedEflows = JSON.parse(eflows.replace(/\bNaN\b/g, 'null'));
        parsedEflows.eflows_ts.forEach(function(part, index, arr) {
            arr[index].discharge_range = [
                arr[index].min_discharge,
                arr[index].max_discharge,
            ];
            arr[index].low_eflows_level_range = [
                arr[index].min_low_eflow_level,
                arr[index].max_low_eflow_level,
            ];
            arr[index].base_eflows_level_range = [
                arr[index].min_base_eflow_level,
                arr[index].max_base_eflow_level,
            ];
            arr[index].subsistence_eflows_level_range = [
                arr[index].min_subsistence_eflow_level,
                arr[index].max_subsistence_eflow_level,
            ];
            arr[index].critical_eflows_level_range = [
                arr[index].min_critical_eflow_level,
                arr[index].max_critical_eflow_level,
            ];
        });
        parsedEflows.eflows_ts.forEach(function(part, index, arr) {
            arr[index].second_axis_ts_range = [
                arr[index].min_second_axis_ts,
                arr[index].max_second_axis_ts,
            ];
        });

        yield put(receiveEflows(parsedEflows));
    } catch (err) {
        console.error('Something went wrong: eflows fetching');
        console.error(err);
    }
}

export const fetchEflowsInitialWorker = ({ params }) => {
    fetchEflowsAction(
        params.stationId,
        params.from,
        params.to,
        params.area,
        params.areaFactor,
        params.fetId,
        params.secondAxisType,
        params.meanLowFlowMethod,
        params.meanLowFlowMethodFrequency,
        params.enableForecasting,
    );
};

export default function* fetchEflowsWatcher() {
    yield takeLatest(FETCH_EFLOWS_ACTION_TYPE, fetchEflows);
}
