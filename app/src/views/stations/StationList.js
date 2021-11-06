/* eslint-disable global-require, no-underscore-dangle, jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, createRef, useRef } from 'react';
import PropTypes from 'prop-types';
import { useWindowSize } from 'react-use';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import {
    Map,
    Marker,
    Popup,
    Tooltip,
    TileLayer,
} from 'react-leaflet-universal';
import 'leaflet/dist/leaflet.css';

import { H4, Card, Elevation } from '@blueprintjs/core';

import { StationShape } from 'utils/types';
import withView from 'decorators/withView';
import { StationLabel } from 'components/stations/shared/StationLabel';
import ServerErrorToaster from 'components/ServerErrorToaster';

const StationList = ({ stations }) => {
    const { width, height } = useWindowSize();
    const [selectedCenter, setSelectedCenter] = useState([58.75, 25.0]);
    const [enteredStationName, setEnteredStationName] = useState('');

    const stationsRefs = Object.assign(
        {},
        ...stations.map((s) => ({ [s.id]: createRef() })),
    );
    const leafletRef = useRef(null);

    useEffect(() => {
        const L = require('leaflet');

        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });

        return () => setSelectedCenter(null);
    }, []);

    const nameFilter = stations.filter((station) =>
        station.name.toLowerCase().startsWith(enteredStationName.toLowerCase()),
    );
    const riverFilter = stations.filter((station) =>
        station.river_body
            .toLowerCase()
            .startsWith(enteredStationName.toLowerCase()),
    );

    const filteredStations = [...new Set([...nameFilter, ...riverFilter])];

    const openPopup = (marker, station) => {
        setSelectedCenter([station.latitude, station.longitude]);
        if (marker && marker.leafletElement) {
            window.setTimeout(() => {
                marker.leafletElement.openPopup();
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Gauging stations map</title>
                <body className="stations-list" />
            </Helmet>
            <div className="d-flex flex-row map-container">
                <ServerErrorToaster />
                <div className="d-flex flex-column searchbox">
                    <H4>Select a gauging station:</H4>
                    <div className="bp3-input-group bp3-round bp3-large mb-3">
                        <span className="bp3-icon bp3-icon-search" />
                        <input
                            type="text"
                            className="bp3-input bp3-round bp3-large"
                            placeholder="Search"
                            onChange={(e) =>
                                setEnteredStationName(e.target.value)
                            }
                            value={enteredStationName}
                        />
                        <button
                            className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-arrow-right bp3-round bp3-large"
                            type="button"
                        />
                    </div>
                    <div className="items-list px-2 py-1">
                        {filteredStations && filteredStations.length > 0 ? (
                            filteredStations.map((station) => (
                                <Card
                                    interactive={false}
                                    elevation={Elevation.ZERO}
                                    key={station.id}
                                >
                                    <StationLabel
                                        station={station}
                                        showOnMapButton
                                        onShowOnMap={() =>
                                            openPopup(
                                                stationsRefs[station.id]
                                                    .current,
                                                station,
                                            )
                                        }
                                    />
                                </Card>
                            ))
                        ) : (
                            <span className="empty-results">
                                No stations found.
                            </span>
                        )}
                    </div>
                </div>
                <Map
                    center={selectedCenter}
                    zoom={8}
                    className="map"
                    minZoom={3}
                    style={{ width: width - 400, height: height - 50 }}
                    leafletRef={leafletRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {stations.map((station) => (
                        <Marker
                            position={[station.latitude, station.longitude]}
                            key={station.id}
                            onClick={() =>
                                setSelectedCenter([
                                    station.latitude,
                                    station.longitude,
                                ])
                            }
                            ref={stationsRefs[station.id]}
                        >
                            <Tooltip permanent direction="bottom">
                                {station.name}
                            </Tooltip>
                            <Popup>
                                <StationLabel
                                    station={station}
                                    showOnMapButton={false}
                                    onShowOnMap={() =>
                                        openPopup(
                                            stationsRefs[station.id].current,
                                        )
                                    }
                                />
                            </Popup>
                        </Marker>
                    ))}
                </Map>
            </div>
        </>
    );
};

StationList.propTypes = {
    stations: PropTypes.arrayOf(StationShape),
};

StationList.defaultProps = {
    stations: [],
};

const mapStateToProps = (state) => ({
    stations: state.station.stations,
});

export default withView()(connect(mapStateToProps, null)(StationList));
