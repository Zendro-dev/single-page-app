import { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Export from '@material-ui/icons/SaveAlt';
import ButtonBase from '@material-ui/core/ButtonBase';
import { request } from 'graphql-request';
import useSWR from 'swr';

import ClickableIcon from './clickableIcon.jsx';

const fetcher = (query) => {
  console.log('FETCHING...');
  return request('http://localhost:3000/graphql', query);
};

export default function DownloadMenu(props) {
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [downloadTemplate, setDownloadTemplate] = useState(false);

  const download = (data) => {
    console.log('from download data', data);
    setDownloadTemplate(false);
  };

  const { data, error } = useSWR(
    downloadTemplate ? `{csvTableTemplate${props.modelName}}` : null,
    fetcher,
    { onSuccess: download }
  );

  const handleClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setDownloadAnchorEl(null);
  };

  const exportServerUrl = 'http://localhost:3000/export';

  const handleDownloadTemplate = () => {
    setDownloadTemplate(true);
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
        <MenuItem onClick={handleDownloadTemplate}>
          Download table template to CSV file
        </MenuItem>
        <MenuItem onClick={handleClose}>Export data to CSV file</MenuItem>

        <MenuItem>
          <form action={exportServerUrl}>
            <input type="hidden" name="model" value="user" />
            <ButtonBase color="default" type="submit" onClick={handleClose}>
              Export data to CSV file 2
            </ButtonBase>
          </form>
        </MenuItem>
      </Menu>
    </>
  );
}
