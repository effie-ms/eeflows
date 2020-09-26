import React from 'react';

import { Intent, ProgressBar } from '@blueprintjs/core';

import { gettext } from 'utils/text';

export const ProcessingState = () => (
    <>
        <p style={{ fontSize: 16 }}>{gettext('Loading')}...</p>
        <ProgressBar intent={Intent.PRIMARY} value={null} />
    </>
);
