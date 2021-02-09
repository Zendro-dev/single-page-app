import { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Export from '@material-ui/icons/SaveAlt';

import ClickableIcon from './clickableIcon.jsx';
export default function DownloadMenu() {
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);

  const handleClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setDownloadAnchorEl(null);
  };

  return (
    <>
      <ClickableIcon tooltip="Download options" handleOnClick={handleClick}>
        <Export color="primary" />
      </ClickableIcon>
      <Menu
        anchorEl={downloadAnchorEl}
        keepMounted
        open={Boolean(downloadAnchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          Download table template to CSV file
        </MenuItem>
        <MenuItem onClick={handleClose}>Export data to CSV file</MenuItem>
      </Menu>
    </>
  );
}
