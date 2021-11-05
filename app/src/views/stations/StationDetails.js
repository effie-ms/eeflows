import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { resolvePath as urlResolve } from 'tg-named-routes';
import { Container } from 'reactstrap';
import { selectStation } from 'schemas/stations';
import { StationShape, EflowsResponseShape } from 'utils/types';
import { gettext } from 'utils/text';
import withView from 'decorators/withView';
import { fetchEflowsAction } from 'sagas/stations/fetchEflows';
import { Configuration } from 'components/stations/Configuration';
import { Graphs } from 'components/stations/Graphs';
import ServerErrorToaster from 'components/ServerErrorToaster';

const scrollToRef = (ref) =>
    window.scrollTo(0, ref.current !== null ? ref.current.offsetTop : 0);

const StationDetails = ({ station, eflows, onFetchEflows }) => {
    const graphRef = useRef(null);

    const [showGraphs, setShowGraphs] = useState(false);

    // Date range picker
    const [startDate, setStartDate] = useState(new Date(2016, 0, 1));
    const [endDate, setEndDate] = useState(new Date(2016, 11, 31));

    // Secondary axis
    const [showSecondaryAxis, setShowSecondaryAxis] = useState(true);
    const [secondAxisTimeSeriesType, setSecondAxisTimeSeriesType] = useState(
        'TW',
    );
    const [secondAxisThreshold, setSecondAxisThreshold] = useState(16);
    const [secondAxisMeasurementType, setSecondAxisMeasurementType] = useState(
        'avg',
    );

    // Eflow configuration
    const [eflowMeasurementType, setEflowMeasurementType] = useState('avg');

    const [showProcessingBar, setShowProcessingBar] = useState(false);

    // Mean low flow configuration
    const [meanLowFlowMethod, setMeanLowFlowMethod] = useState('TNT30');
    const [
        meanLowFlowMethodFrequency,
        setMeanLowFlowMethodFrequency,
    ] = useState('BIOPERIOD');

    useEffect(() => {
        if (eflows !== null && eflows.length !== 0) {
            setShowProcessingBar(false);
        }
    }, [eflows]);

    useEffect(() => {
        if (eflows !== null && eflows.length !== 0 && graphRef !== null) {
            scrollToRef(graphRef);
        }
    });

    useEffect(() => {
        if (showProcessingBar === true && graphRef !== null) {
            scrollToRef(graphRef);
        }
    }, [showProcessingBar]);

    useEffect(() => {
        eflows = null; // eslint-disable-line no-param-reassign
        setShowGraphs(false);
    }, [
        startDate,
        endDate,
        secondAxisTimeSeriesType,
        secondAxisThreshold,
        meanLowFlowMethod,
        meanLowFlowMethodFrequency,
        station,
    ]);

    const onRunEstimation = () => {
        if (
            startDate &&
            endDate &&
            secondAxisThreshold !== undefined &&
            secondAxisTimeSeriesType
        ) {
            eflows = null; // eslint-disable-line no-param-reassign
            setShowProcessingBar(true);
            setShowGraphs(true);
            onFetchEflows(
                startDate,
                endDate,
                secondAxisTimeSeriesType,
                meanLowFlowMethod,
                meanLowFlowMethodFrequency,
            );
        }
    };

    const onSetDateRange = ([from, to]) => {
        setStartDate(from);
        setEndDate(to);
    };

    const onSetMeanLowFlowMethod = (_meanLowFlowMethod) => {
        setMeanLowFlowMethod(_meanLowFlowMethod);
    };

    const onSetSecondAxisThreshold = (thresholdValue) => {
        let thresholdNumber = parseFloat(thresholdValue);
        if (!thresholdNumber) {
            thresholdNumber = 0;
        }
        setSecondAxisThreshold(thresholdNumber);
    };

    const eflowsTS = eflows !== null ? eflows.eflows_ts : [];
    const bioperiodsBoundaries = eflows ? eflows.bioperiods_boundaries : [];

    return (
        <>
            <Helmet>
                <title>{gettext('Station details')}</title>
                <body className="station-details" />
            </Helmet>
            <Container className="station-container">
                <ServerErrorToaster />
                <div className="content">
                    <div className="station">
                        <div className="title-block">
                            <Link
                                to={urlResolve('landing')}
                                className="btn-back"
                            />
                            <div className="title">{station.name}</div>
                        </div>
                        <Configuration
                            startDate={startDate}
                            endDate={endDate}
                            onSetDateRange={onSetDateRange}
                            secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                            onSetSecondAxisTimeSeriesType={
                                setSecondAxisTimeSeriesType
                            }
                            secondAxisThreshold={secondAxisThreshold}
                            onSetSecondAxisThreshold={onSetSecondAxisThreshold}
                            meanLowFlowMethod={meanLowFlowMethod}
                            onSetMeanLowFlowMethod={onSetMeanLowFlowMethod}
                            meanLowFlowMethodFrequency={
                                meanLowFlowMethodFrequency
                            }
                            onSetMeanLowFlowMethodFrequency={
                                setMeanLowFlowMethodFrequency
                            }
                            onRunEstimation={onRunEstimation}
                        />
                        {(eflows !== null || showProcessingBar === true) &&
                            showGraphs && (
                                <Graphs
                                    stationName={station.name}
                                    startDate={startDate}
                                    endDate={endDate}
                                    showSecondaryAxis={showSecondaryAxis}
                                    secondAxisTimeSeriesType={
                                        secondAxisTimeSeriesType
                                    }
                                    showProcessingBar={showProcessingBar}
                                    eflowsTS={eflowsTS}
                                    eflowMeasurementType={eflowMeasurementType}
                                    secondAxisMeasurementType={
                                        secondAxisMeasurementType
                                    }
                                    secondAxisThreshold={secondAxisThreshold}
                                    bioperiodsBoundaries={bioperiodsBoundaries}
                                    graphRef={graphRef}
                                    onSetEflowMeasurementType={
                                        setEflowMeasurementType
                                    }
                                    onSetSecondAxisMeasurementType={
                                        setSecondAxisMeasurementType
                                    }
                                    setShowSecondaryAxis={setShowSecondaryAxis}
                                />
                            )}
                    </div>
                </div>
            </Container>
        </>
    );
};

StationDetails.propTypes = {
    station: StationShape.isRequired,
    eflows: EflowsResponseShape,
    onFetchEflows: PropTypes.func.isRequired,
};

StationDetails.defaultProps = {
    eflows: null,
};

const mapStateToProps = (state, ownProps) => ({
    station: selectStation(state, ownProps.match.params.stationId),
    eflows: state.station.eflows,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onFetchEflows: (
        from,
        to,
        secondAxisType,
        meanLowFlowMethod,
        meanLowFlowMethodFrequency,
    ) =>
        dispatch(
            fetchEflowsAction(
                ownProps.match.params.stationId,
                from,
                to,
                secondAxisType,
                meanLowFlowMethod,
                meanLowFlowMethodFrequency,
            ),
        ),
});

const StationDetailsViewConnector = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StationDetails);

export default withView()(StationDetailsViewConnector);
