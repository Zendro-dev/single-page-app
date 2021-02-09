import Grid from '@material-ui/core/Grid';
import Reload from '@material-ui/icons/Replay';
import Add from '@material-ui/icons/AddBox';
import Import from '@material-ui/icons/UnarchiveOutlined';

import ClickableIcon from './clickableIcon.jsx';
import SearchField from './searchField.jsx';
import DownloadMenu from './downloadMenu.jsx';

export default function TableToolBar(props) {
  const {
    onReloadClick,
    handleAddClicked,
    handleBulkImportClicked,
    handleDownloadsIconClick,
  } = props;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container justify="flex-end" alignItems="center" wrap="wrap">
          <ClickableIcon tooltip="Reload list" handleOnClick={onReloadClick}>
            <Reload color="inherit" fontSize="small" />
          </ClickableIcon>

          <SearchField />

          <ClickableIcon
            tooltip="Add new no_assoc"
            handleOnClick={handleAddClicked}
          >
            <Add color="primary" />
          </ClickableIcon>

          <ClickableIcon
            tooltip="Import from csv"
            handleOnClick={handleBulkImportClicked}
          >
            <Import color="primary" />
          </ClickableIcon>

          <DownloadMenu></DownloadMenu>
        </Grid>
      </Grid>
    </Grid>
  );
}
