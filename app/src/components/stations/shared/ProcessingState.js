import React from 'react';

import { Intent, ProgressBar } from '@blueprintjs/core';

import { gettext } from 'utils/text';

export const ProcessingState = () => (
    <div className="w-100">
        <p style={{ fontSize: 20 }}>{gettext('Loading')}...</p>
        <ProgressBar intent={Intent.PRIMARY} value={null} />
    </div>
);
