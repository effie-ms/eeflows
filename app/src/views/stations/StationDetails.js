import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { resolvePath as urlResolve } from 'tg-named-routes';
import { Container } from 'reactstrap';

import { selectStation } from 'schemas/stations';
import { StationShape, FETInfoShape, EflowsResponseShape } from 'utils/types';
import { gettext } from 'utils/text';
import withView from 'decorators/withView';
import { fetchEflowsAction } from 'sagas/stations/fetchEflows';

import { Configuration } from 'components/stations/Configuration';
import { Graphs } from 'components/stations/Graphs';

const scrollToRef = ref =>
    window.scrollTo(0, ref.current !== null ? ref.current.offsetTop : 0);

const StationDetails = ({ station, eflows, onFetchEflows, fets }) => {
    const graphRef = useRef(null);

    const [showGraphs, setShowGraphs] = useState(false);

    // Date range picker
    const [startDate, setStartDate] = useState(new Date(2016, 0, 1));
    const [endDate, setEndDate] = useState(new Date(2016, 11, 31));

    // Catchment area configuration
    const [areaFactor, setAreaFactor] = useState(1);
    const [catchmentArea, setCatchmentArea] = useState(station.catchment_area);

    // FET configuration
    const [selectedFETId, setSelectedFETId] = useState(station.river_FET.id);

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
    const [eflowThreshold, setEflowThreshold] = useState('low');
    const [eflowMeasurementType, setEflowMeasurementType] = useState('avg');

    const [showProcessingBar, setShowProcessingBar] = useState(false);

    // Forecast configuration
    const [showFullForecastDischarge, setShowFullForecastDischarge] = useState(
        true,
    );

    const [
        showFullForecastSecondAxis,
        setShowFullForecastSecondAxis,
    ] = useState(true);

    const [
        fillMissingValuesDischarge,
        setFillMissingValuesDischarge,
    ] = useState(true);

    const [
        fillMissingValuesSecondAxis,
        setFillMissingValuesSecondAxis,
    ] = useState(true);

    const [
        multiStationsForecastDischarge,
        setMultiStationsForecastDischarge,
    ] = useState(true);

    const [
        multiStationsForecastSecondAxis,
        setMultiStationsForecastSecondAxis,
    ] = useState(true);

    const [forecastEflowsVariable, setForecastEflowsVariable] = useState('Q');

    const [
        forecastSecondAxisVariable,
        setForecastSecondAxisVariable,
    ] = useState('TW');

    // Mean low flow configuration
    const [meanLowFlowMethod, setMeanLowFlowMethod] = useState('TNT30');
    const [
        meanLowFlowMethodFrequency,
        setMeanLowFlowMethodFrequency,
    ] = useState('BIOPERIOD');

    const [
        multiplyByFishCoefficients,
        setMultiplyByFishCoefficients,
    ] = useState(true);

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
        catchmentArea,
        areaFactor,
        selectedFETId,
        secondAxisTimeSeriesType,
        secondAxisThreshold,
        fillMissingValuesDischarge,
        fillMissingValuesSecondAxis,
        multiStationsForecastDischarge,
        multiStationsForecastSecondAxis,
        forecastEflowsVariable,
        forecastSecondAxisVariable,
        meanLowFlowMethod,
        meanLowFlowMethodFrequency,
        multiplyByFishCoefficients,
        station,
    ]);

    const onRunEstimation = () => {
        if (
            startDate &&
            endDate &&
            secondAxisThreshold !== undefined &&
            catchmentArea !== undefined &&
            areaFactor !== undefined &&
            secondAxisTimeSeriesType &&
            selectedFETId
        ) {
            eflows = null; // eslint-disable-line no-param-reassign
            setShowProcessingBar(true);
            setShowGraphs(true);
            onFetchEflows(
                startDate,
                endDate,
                catchmentArea,
                areaFactor,
                selectedFETId,
                secondAxisTimeSeriesType,
                secondAxisThreshold,
                fillMissingValuesDischarge,
                fillMissingValuesSecondAxis,
                multiStationsForecastDischarge,
                multiStationsForecastSecondAxis,
                forecastEflowsVariable,
                forecastSecondAxisVariable,
                meanLowFlowMethod,
                meanLowFlowMethodFrequency,
                multiplyByFishCoefficients,
            );
        }
    };

    const onSetDateRange = ([from, to]) => {
        setStartDate(from);
        setEndDate(to);
    };

    const onSetSecondAxisThreshold = thresholdValue => {
        let thresholdNumber = parseFloat(thresholdValue);
        if (!thresholdNumber) {
            thresholdNumber = 0;
        }
        setSecondAxisThreshold(thresholdNumber);
    };

    const onSetAreaFactor = _areaFactor => {
        const areaFactorNumber = parseFloat(_areaFactor);
        if (!areaFactorNumber) {
            setAreaFactor(1);
        } else {
            setAreaFactor(areaFactorNumber);
        }
    };

    const onSetCatchmentArea = _catchmentArea => {
        const catchmentAreaNumber = parseFloat(_catchmentArea);
        if (catchmentAreaNumber) {
            setCatchmentArea(catchmentAreaNumber);
        } else {
            setCatchmentArea(1);
        }
    };

    const eflowsTS = eflows !== null ? eflows.eflows_ts : [];
    const bioperiodsBoundaries = eflows ? eflows.bioperiods_boundaries : [];

    const forecastingSummary = eflows ? eflows.forecasting_summary : null;

    return (
        <>
            <Helmet>
                <title>{gettext('Station details')}</title>
                <body className="station-details" />
            </Helmet>
            <Container className="station-container">
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
                            catchmentArea={catchmentArea}
                            onSetCatchmentArea={onSetCatchmentArea}
                            areaFactor={areaFactor}
                            onSetAreaFactor={onSetAreaFactor}
                            eflowThreshold={eflowThreshold}
                            onSetEflowThreshold={setEflowThreshold}
                            fets={fets}
                            selectedFETId={selectedFETId}
                            onSetSelectedFETId={setSelectedFETId}
                            eflowMeasurementType={eflowMeasurementType}
                            onSetEflowMeasurementType={setEflowMeasurementType}
                            secondAxisMeasurementType={
                                secondAxisMeasurementType
                            }
                            onSetSecondAxisMeasurementType={
                                setSecondAxisMeasurementType
                            }
                            secondAxisTimeSeriesType={secondAxisTimeSeriesType}
                            onSetSecondAxisTimeSeriesType={
                                setSecondAxisTimeSeriesType
                            }
                            secondAxisThreshold={secondAxisThreshold}
                            onSetSecondAxisThreshold={onSetSecondAxisThreshold}
                            showSecondaryAxis={showSecondaryAxis}
                            setShowSecondaryAxis={setShowSecondaryAxis}
                            fillMissingValuesDischarge={
                                fillMissingValuesDischarge
                            }
                            setFillMissingValuesDischarge={
                                setFillMissingValuesDischarge
                            }
                            showFullForecastDischarge={
                                showFullForecastDischarge
                            }
                            setShowFullForecastDischarge={
                                setShowFullForecastDischarge
                            }
                            multiStationsForecastDischarge={
                                multiStationsForecastDischarge
                            }
                            setMultiStationsForecastDischarge={
                                setMultiStationsForecastDischarge
                            }
                            fillMissingValuesSecondAxis={
                                fillMissingValuesSecondAxis
                            }
                            setFillMissingValuesSecondAxis={
                                setFillMissingValuesSecondAxis
                            }
                            showFullForecastSecondAxis={
                                showFullForecastSecondAxis
                            }
                            setShowFullForecastSecondAxis={
                                setShowFullForecastSecondAxis
                            }
                            multiStationsForecastSecondAxis={
                                multiStationsForecastSecondAxis
                            }
                            setMultiStationsForecastSecondAxis={
                                setMultiStationsForecastSecondAxis
                            }
                            forecastEflowsVariable={forecastEflowsVariable}
                            setForecastEflowsVariable={
                                setForecastEflowsVariable
                            }
                            forecastSecondAxisVariable={
                                forecastSecondAxisVariable
                            }
                            setForecastSecondAxisVariable={
                                setForecastSecondAxisVariable
                            }
                            meanLowFlowMethod={meanLowFlowMethod}
                            onSetMeanLowFlowMethod={setMeanLowFlowMethod}
                            meanLowFlowMethodFrequency={
                                meanLowFlowMethodFrequency
                            }
                            onSetMeanLowFlowMethodFrequency={
                                setMeanLowFlowMethodFrequency
                            }
                            multiplyByFishCoefficients={
                                multiplyByFishCoefficients
                            }
                            onSetMultiplyByFishCoefficients={
                                setMultiplyByFishCoefficients
                            }
                            onRunEstimation={onRunEstimation}
                            watershed={station.catchment_area}
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
                                    eflowThreshold={eflowThreshold}
                                    secondAxisMeasurementType={
                                        secondAxisMeasurementType
                                    }
                                    secondAxisThreshold={secondAxisThreshold}
                                    areaFactor={areaFactor}
                                    bioperiodsBoundaries={bioperiodsBoundaries}
                                    showFullForecastDischarge={
                                        showFullForecastDischarge
                                    }
                                    showFullForecastSecondAxis={
                                        showFullForecastSecondAxis
                                    }
                                    forecastingSummary={forecastingSummary}
                                    graphRef={graphRef}
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
    fets: PropTypes.arrayOf(FETInfoShape),
};

StationDetails.defaultProps = {
    eflows: null,
    fets: [],
};

const mapStateToProps = (state, ownProps) => ({
    station: selectStation(state, ownProps.match.params.stationId),
    fets: state.station.stations.fets,
    eflows: state.station.eflows,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onFetchEflows: (
        from,
        to,
        area,
        areaFactor,
        fetId,
        secondAxisType,
        secondAxisThreshold,
        fillMissingEflows,
        fillMissingSecondAxis,
        forecastMultiStationsEflows,
        forecastMultiStationsSecondAxis,
        forecastEflowsVariable,
        forecastSecondAxisVariable,
        meanLowFlowMethod,
        meanLowFlowMethodFrequency,
        multiplyByFishCoefficients,
    ) =>
        dispatch(
            fetchEflowsAction(
                ownProps.match.params.stationId,
                from,
                to,
                area,
                areaFactor,
                fetId,
                secondAxisType,
                secondAxisThreshold,
                fillMissingEflows,
                fillMissingSecondAxis,
                forecastMultiStationsEflows,
                forecastMultiStationsSecondAxis,
                forecastEflowsVariable,
                forecastSecondAxisVariable,
                meanLowFlowMethod,
                meanLowFlowMethodFrequency,
                multiplyByFishCoefficients,
            ),
        ),
});

const StationDetailsViewConnector = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StationDetails);

export default withView()(StationDetailsViewConnector);
