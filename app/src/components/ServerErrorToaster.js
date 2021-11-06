import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Intent, Position, Toast, Toaster } from '@blueprintjs/core';

import {
    selectorsEflows,
    selectorsStations,
    setServerErrorEflows,
    setServerErrorStations,
} from 'ducks/station';

const ServerErrorToaster = ({
    stationsError,
    eflowsError,
    onSetStationsServerError,
    onSetEflowsServerError,
}) => (
    <Toaster position={Position.TOP_RIGHT}>
        {stationsError && (
            <Toast
                intent={Intent.DANGER}
                message={stationsError}
                onDismiss={() => onSetStationsServerError(null)}
                timeout={-1}
            />
        )}
        {eflowsError && (
            <Toast
                intent={Intent.DANGER}
                message={eflowsError}
                onDismiss={() => onSetEflowsServerError(null)}
                timeout={-1}
            />
        )}
    </Toaster>
);

ServerErrorToaster.propTypes = {
    stationsError: PropTypes.string,
    eflowsError: PropTypes.string,
    onSetStationsServerError: PropTypes.func.isRequired,
    onSetEflowsServerError: PropTypes.func.isRequired,
};

ServerErrorToaster.defaultProps = {
    stationsError: null,
    eflowsError: null,
};

const mapStateToProps = (state) => ({
    stationsError: selectorsStations.selectServerError(state),
    eflowsError: selectorsEflows.selectServerError(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSetStationsServerError: (error) =>
        dispatch(setServerErrorStations(error)),
    onSetEflowsServerError: (error) => dispatch(setServerErrorEflows(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerErrorToaster);
