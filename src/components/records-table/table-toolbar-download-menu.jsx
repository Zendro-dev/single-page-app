import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Export from '@material-ui/icons/SaveAlt';
import ButtonBase from '@material-ui/core/ButtonBase';
import { EXPORT_URL } from '../../config/globals';
import ClickableIcon from '@/components/buttons/icon-button';
import useSWR from 'swr';
import { authSelector } from '../../store/auth-slice';
import { requestOne } from '@/utils/requests';
import { queryCsvTemplate } from '@/utils/queries';

function downloadFile(data, name) {
  const file = data.join('\n');
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
}

export default function DownloadMenu(props) {
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [downloadTemplate, setDownloadTemplate] = useState(false);
  const auth = useSelector(authSelector);

  const onDownload = (data) => {
    setDownloadTemplate(false);
    downloadFile(data, `${props.modelName}-template.csv`);
  };

  const onError = () => {
    //send error to user
  };

  const request = useMemo(() => {
    return queryCsvTemplate(props.modelName);
  }, [props.modelName]);

  useSWR(downloadTemplate ? [auth.user.token, request] : null, requestOne, {
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
