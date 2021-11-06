import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@blueprintjs/core';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import { gettext } from 'utils/text';

export const ExportDropdown = ({
    disabled,
    onDownloadExcel,
    onDownloadImage,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    return (
        <Dropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            direction="left"
            style={{ display: disabled ? 'none' : 'block' }}
        >
            <DropdownToggle outline color="black" className="export-dropdown">
                <Icon icon="archive" iconSize={Icon.SIZE_LARGE} />
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>{gettext('Download as')}</DropdownItem>
                <DropdownItem onClick={onDownloadImage}>
                    {gettext('PNG')}
                </DropdownItem>
                <DropdownItem onClick={onDownloadExcel}>
                    {gettext('XLSX')}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

ExportDropdown.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onDownloadExcel: PropTypes.func.isRequired,
    onDownloadImage: PropTypes.func.isRequired,
};
