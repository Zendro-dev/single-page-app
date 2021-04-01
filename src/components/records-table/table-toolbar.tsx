import { ReactElement, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import {
  AddBox as AddIcon,
  UnarchiveOutlined as ImportIcon,
  Replay as ReloadIcon,
} from '@material-ui/icons';

import ClickableIcon from '../buttons/icon-button';
import SearchField from './table-toolbar-search-field';
import DownloadMenu from './table-toolbar-download-menu';
import UploadDialog from './table-toolbar-upload-dialog';
import { AclPermission } from '@/types/acl';

interface TableToolBarProps {
  modelName: string;
  permissions: AclPermission[];
  onReload: () => void;
  onSearch: (value: string) => void;
  onAdd: () => void;
}

export default function TableToolBar({
  modelName,
  permissions,
  onReload,
  onSearch,
  onAdd,
}: TableToolBarProps): ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  const handleImportClicked = (): void => {
    setDialogOpen(true);
  };

  const handleDone = (): void => {
    setDialogOpen(false);
    onReload();
  };

  return (
    <header className={classes.header}>
      <SearchField onSearchClick={onSearch} />

      <menu className={classes.menu}>
        <ClickableIcon tooltip="Reload list" handleOnClick={onReload}>
          <ReloadIcon color="inherit" fontSize="small" />
        </ClickableIcon>

        {(permissions.includes('create') || permissions.includes('*')) && (
          <>
            <ClickableIcon tooltip="Add new no_assoc" handleOnClick={onAdd}>
              <AddIcon color="primary" />
            </ClickableIcon>

            <ClickableIcon
              tooltip="Import from csv"
              handleOnClick={handleImportClicked}
            >
              <ImportIcon color="primary" />
            </ClickableIcon>
          </>
        )}

        {(permissions.includes('read') || permissions.includes('*')) && (
          <DownloadMenu modelName={modelName}></DownloadMenu>
        )}

        {dialogOpen && (
          <UploadDialog modelName={modelName} handleDone={handleDone} />
        )}
      </menu>
    </header>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing(2),
    },
    menu: {
      display: 'flex',
    },
  })
);
