import { combineReducers } from 'redux';

export const RECEIVE_EFLOWS = 'eflows/RECEIVE_EFLOWS';
export const SET_SERVER_ERROR_EFLOWS = 'eflows/SET_SERVER_ERROR_EFLOWS';

export const eflowsReducer = (state = null, action) => {
    switch (action.type) {
        case RECEIVE_EFLOWS: {
            return action.eflows;
        }
        case SET_SERVER_ERROR_EFLOWS: {
            return {
                ...state,
                serverError: action.serverError,
            };
        }

        default:
            return state;
    }
};

export const receiveEflows = (eflows) => ({
    type: RECEIVE_EFLOWS,
    eflows,
});

export const setServerErrorEflows = (serverError) => ({
    type: SET_SERVER_ERROR_EFLOWS,
    serverError,
});

export const selectorsEflows = {
    selectEflows: (state) => state.station.eflows?.eflows,
    selectServerError: (state) => state.station.eflows?.serverError,
};

export const RECEIVE_STATIONS = 'stations/RECEIVE_STATIONS';
export const SET_SERVER_ERROR_STATIONS = 'stations/SET_SERVER_ERROR_STATIONS';

export const stationsReducer = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_STATIONS: {
            return action.stations;
        }
        case SET_SERVER_ERROR_STATIONS: {
            return {
                ...state,
                serverError: action.serverError,
            };
        }

        default:
            return state;
    }
};

export const receiveStations = (stations) => ({
    type: RECEIVE_STATIONS,
    stations,
});

export const setServerErrorStations = (serverError) => ({
    type: SET_SERVER_ERROR_STATIONS,
    serverError,
});

export const selectorsStations = {
    selectStations: (state) => state.station.stations?.stations,
    selectServerError: (state) => state.station.stations?.serverError,
};

export default combineReducers({
    eflows: eflowsReducer,
    stations: stationsReducer,
});
