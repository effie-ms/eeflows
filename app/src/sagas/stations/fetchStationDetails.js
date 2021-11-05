import { createFetchAction, createFetchSaga } from '@thorgate/spa-entities';
import { takeLatestWithMatch } from '@thorgate/spa-view-manager';
import { resolvePattern } from 'tg-named-routes';
import { SETTINGS } from 'settings';
import api from 'services/api';
import { stationSchema } from 'schemas/stations';

const FETCH_STATION_DETAILS = '@@sagas/stations/FETCH_STATION_DETAILS';
export const fetchStation = createFetchAction(FETCH_STATION_DETAILS);

const fetchStationWorker = createFetchSaga({
    resource: api.station.detail,
    listSchema: [stationSchema],
    key: stationSchema.key,
    timeoutMs: SETTINGS.LONG_SAGA_TIMEOUT,
    useDetails: true,
});

export const fetchStationDetailsInitialWorker = fetchStationWorker.asInitialWorker(
    ({ params }) => fetchStation({ kwargs: { pk: params.stationId } }),
);

export default function* fetchStationDetailsWatcher() {
    yield takeLatestWithMatch(
        FETCH_STATION_DETAILS,
        resolvePattern('station-details'),
        fetchStationWorker,
    );
}
