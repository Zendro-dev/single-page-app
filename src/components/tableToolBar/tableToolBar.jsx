import { useState } from 'react';
import Reload from '@material-ui/icons/Replay';
import Add from '@material-ui/icons/AddBox';
import Import from '@material-ui/icons/UnarchiveOutlined';
import ClickableIcon from './clickableIcon.jsx';
import SearchField from './searchField.jsx';
import DownloadMenu from './downloadMenu.jsx';
import UploadDialog from './uploadDialog.jsx';
import { Box } from '@material-ui/core';
export default function TableToolBar(props) {
  const { onReload, modelName, onSearch, onAdd } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImportClicked = () => {
    setDialogOpen(true);
  };

  const handleDone = () => {
    setDialogOpen(false);
  };

  const handleAddNewClick = () => {
    onAdd('create');
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

      <ClickableIcon
        tooltip="Add new no_assoc"
        handleOnClick={handleAddNewClick}
      >
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
