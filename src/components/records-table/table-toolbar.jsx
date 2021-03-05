import { useState } from 'react';
import Reload from '@material-ui/icons/Replay';
import Add from '@material-ui/icons/AddBox';
import Import from '@material-ui/icons/UnarchiveOutlined';
import ClickableIcon from '../buttons/icon-button';
import SearchField from './table-toolbar-search-field';
import DownloadMenu from './table-toolbar-download-menu';
import UploadDialog from './table-toolbar-upload-dialog';
import { Box } from '@material-ui/core';

export default function TableToolBar(props) {
  const { onReload, modelName, onSearch, onAdd } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImportClicked = () => {
    setDialogOpen(true);
  };

  const handleDone = () => {
    setDialogOpen(false);
    onReload()
  };

  return (
    <Box
      display="flex"
      marginY="0.5rem"
      alignItems="center"
      justifyContent="flex-end"
    >
      <ClickableIcon tooltip="Reload list" handleOnClick={onReload}>
        <Reload color="inherit" fontSize="small" />
      </ClickableIcon>

      <SearchField onSearchClick={onSearch} />

      <ClickableIcon tooltip="Add new no_assoc" handleOnClick={onAdd}>
        <Add color="primary" />
      </ClickableIcon>

      <ClickableIcon
        tooltip="Import from csv"
        handleOnClick={handleImportClicked}
      >
        <Import color="primary" />
      </ClickableIcon>

      {dialogOpen && (
        <UploadDialog modelName={modelName} handleDone={handleDone} />
      )}

      <DownloadMenu modelName={modelName}></DownloadMenu>
    </Box>
  );
}
