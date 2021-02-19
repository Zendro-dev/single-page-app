import { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Export from '@material-ui/icons/SaveAlt';
import ButtonBase from '@material-ui/core/ButtonBase';
import { EXPORT_URL } from '../../config/globals';
import ClickableIcon from './clickableIcon.jsx';
import useSWR from 'swr';
import { fetcherTemplate } from '../../utils/fetcher';

export default function DownloadMenu(props) {
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [downloadTemplate, setDownloadTemplate] = useState(false);

  const onDownload = (data) => {
    let file = data.join('\n');
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${props.modelName}no_assoc-template.csv`);
    document.body.appendChild(link);
    link.click();
    setDownloadTemplate(false);
  };

  const onError = (error) => {
    //send error to user
  };

  useSWR(downloadTemplate ? ['User'] : null, fetcherTemplate, {
    onSuccess: onDownload,
    onError: onError,
  });

  const handleClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setDownloadAnchorEl(null);
  };

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

        <MenuItem>
          <form action={EXPORT_URL}>
            <input type="hidden" name="model" value={props.modelName} />
            <ButtonBase color="default" type="submit" onClick={handleClose}>
              Export data to CSV file 2
            </ButtonBase>
          </form>
        </MenuItem>
      </Menu>
    </>
  );
}
