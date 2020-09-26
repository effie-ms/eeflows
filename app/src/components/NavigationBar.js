import React from 'react';
import { withRouter } from 'react-router-dom';

import {
    Alignment,
    Navbar,
    NavbarGroup,
    NavbarHeading,
} from '@blueprintjs/core';

const NavigationBar = () => (
    <Navbar className="bp3-dark">
        <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>
                EEFlows{' '}
                <span className="bp3-tag bp3-round bp3-minimal">v1.1</span>
            </NavbarHeading>
        </NavbarGroup>
    </Navbar>
);

export default withRouter(NavigationBar);
