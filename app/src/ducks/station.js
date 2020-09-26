import { combineReducers } from 'redux';

export const RECEIVE_EFLOWS = 'eflows/RECEIVE_EFLOWS';

export const eflowsReducer = (state = null, action) => {
    switch (action.type) {
        case RECEIVE_EFLOWS: {
            return action.eflows;
        }

        default:
            return state;
    }
};

export const receiveEflows = eflows => ({
    type: RECEIVE_EFLOWS,
    eflows,
});

export const RECEIVE_STATIONS_AND_FETS = 'stations/RECEIVE_STATIONS_AND_FETS';

export const stationsReducer = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_STATIONS_AND_FETS: {
            return action.stations;
        }

        default:
            return state;
    }
};

export const receiveStations = stations => ({
    type: RECEIVE_STATIONS_AND_FETS,
    stations,
});

export default combineReducers({
    eflows: eflowsReducer,
    stations: stationsReducer,
});
