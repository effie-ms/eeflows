import React from 'react';
import { gettext } from 'utils/text';

export const EmptyState = () => (
    <i className="w-100" style={{ fontSize: 20 }}>
        {gettext('No loaded data available.')}
    </i>
);
