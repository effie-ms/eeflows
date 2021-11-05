import PropTypes from 'prop-types';

export const StationShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    river_body: PropTypes.string.isRequired,
    watershed_area: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
});

export const EflowsShape = PropTypes.shape({
    date: PropTypes.string.isRequired,
    bioperiod: PropTypes.oneOf(['OW', 'SS', 'RG', 'FS']),
    min_discharge: PropTypes.number,
    avg_discharge: PropTypes.number,
    max_discharge: PropTypes.number,
    discharge_range: PropTypes.arrayOf(PropTypes.number),
    low_eflows_level_range: PropTypes.arrayOf(PropTypes.number),
    min_low_eflow_level: PropTypes.number,
    avg_low_eflow_level: PropTypes.number,
    max_low_eflow_level: PropTypes.number,
    min_second_axis_ts: PropTypes.number,
    max_second_axis_ts: PropTypes.number,
    avg_second_axis_ts: PropTypes.number,
    second_axis_ts_range: PropTypes.arrayOf(PropTypes.number),
});

export const BioperiodBoundaryShape = PropTypes.shape({
    date: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
});

export const EflowsResponseShape = PropTypes.shape({
    eflows_ts: PropTypes.arrayOf(EflowsShape).isRequired,
    bioperiods_boundaries: PropTypes.arrayOf(BioperiodBoundaryShape),
});
