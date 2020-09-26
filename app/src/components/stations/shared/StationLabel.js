import React from 'react';
import PropTypes from 'prop-types';
import { H5, H6, AnchorButton, Button } from '@blueprintjs/core';
import { StationShape } from 'utils/types';

export const StationLabel = ({ station, showOnMapButton, onShowOnMap }) => (
    <div className="d-flex flex-column">
        <H5>{station.name}</H5>
        <div className="d-inline-flex">
            <H6>River body: &nbsp;</H6>
            <p className="m-0">{station.river_body}</p>
        </div>
        <div className="d-inline-flex flex-wrap">
            <H6>Fish ecological type: &nbsp;</H6>
            <p className="m-0">{`FET ${station.river_FET.fet_short_label}: ${station.river_FET.fet_name}`}</p>
        </div>
        <div className="d-inline-flex">
            <H6>Watershed area: &nbsp;</H6>
            <p className="m-0">
                {station.catchment_area} km<sup>2</sup>
            </p>
        </div>
        <div className="d-inline-flex">
            <H6>Location: &nbsp;</H6>
            <p className="m-0">{`(${station.latitude.toFixed(
                2,
            )}; ${station.longitude.toFixed(2)})`}</p>
        </div>
        <div className="d-flex flex-row flex-wrap justify-content-between">
            <AnchorButton
                href={`/stations/${station.id}`}
                className="bp3-button-text py-2"
            >
                Details
            </AnchorButton>
            {showOnMapButton && (
                <Button
                    key={station.id}
                    className="bp3-button-text py-2"
                    text="See on the map"
                    onClick={onShowOnMap}
                />
            )}
        </div>
    </div>
);

StationLabel.propTypes = {
    station: StationShape.isRequired,
    showOnMapButton: PropTypes.bool.isRequired,
    onShowOnMap: PropTypes.func.isRequired,
};
