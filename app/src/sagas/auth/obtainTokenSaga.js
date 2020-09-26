import {
    createSaveAction,
    createFormSaveSaga,
    formErrorsHandler,
} from '@thorgate/spa-forms';
import { call, select, takeLatest, put } from 'redux-saga/effects';
import { getLocation, push } from 'connected-react-router';
import qs from 'qs';
import { resolvePath as urlResolve } from 'tg-named-routes';

import { saveToken } from 'sagas/helpers/token';
import api from 'services/api';

/**
 * Trigger obtain token watcher saga.
 * @returns Created trigger action
 */
export const obtainToken = createSaveAction('@@sagas/auth/OBTAIN_TOKEN');

function* successHook(result) {
    console.log('SUCCESS');
    const { access, refresh } = result;
    saveToken(access, refresh);

    const location = yield select(getLocation);
    let { next } = qs.parse(location.search || '', { ignoreQueryPrefix: true });

    if (!next) {
        next = urlResolve('landing');
    }

    yield put(push(next));
}

function* errorHook(options) {
    yield call(formErrorsHandler, options);
    if (
        options.error !== undefined &&
        options.error !== null &&
        options.error.responseText !== undefined
    ) {
        options.setStatus({
            message: JSON.parse(options.error.responseText).detail,
        });
    }
}

const obtainTokenSaga = createFormSaveSaga({
    resource: api.auth.obtain,
    successHook,
    errorHook,
});

export default function* loginWatcherSaga() {
    yield takeLatest(obtainToken.getType(), obtainTokenSaga, null);
}
