import { MouseEventHandler, ReactElement, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Export from '@material-ui/icons/SaveAlt';
import ButtonBase from '@material-ui/core/ButtonBase';
import { EXPORT_URL } from '../../config/globals';
import ClickableIcon from '@/components/buttons/icon-button';
import { queryCsvTemplate } from '@/utils/queries';
import useToastNotification from '@/hooks/useToastNotification';
import { useZendroClient } from '@/hooks';

function downloadFile(data: unknown[], name: string): void {
  const file = data.join('\n');
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
}

interface DownloadMenuProps {
  modelName: string;
}

export default function DownloadMenu({
  modelName,
}: DownloadMenuProps): ReactElement {
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<Element | null>(
    null
  );
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setDownloadAnchorEl(null);
  };

  const handleDownloadTemplate = async (): Promise<void> => {
    const request = queryCsvTemplate(modelName);
    console.log(request);
    try {
      const response = await zendro.request(request.query);
      downloadFile(response[request.resolver], `${modelName}-template.csv`);
    } catch (error) {
      showSnackbar('Error in request to server', 'error', error);
    }

    setDownloadAnchorEl(null);
  };

  return (
    <>
      <ClickableIcon tooltip="Download options" onClick={handleClick}>
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
            <input type="hidden" name="model" value={modelName} />
            <ButtonBase color="default" type="submit" onClick={handleClose}>
              Export data to CSV file 2
            </ButtonBase>
          </form>
        </MenuItem>
      </Menu>
    </>
  );
}
