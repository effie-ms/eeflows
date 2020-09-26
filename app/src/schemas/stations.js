import {
    createDetailSchemaSelector,
    createSchemaSelector,
} from '@thorgate/spa-entities';
import { schema } from 'normalizr';

export const stationSchema = new schema.Entity('station');

export const selectStations = createSchemaSelector(stationSchema);
export const selectStation = createDetailSchemaSelector(stationSchema);
