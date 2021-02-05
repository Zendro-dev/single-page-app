import { TextField } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Backspace';
import InputAdornment from '@material-ui/core/InputAdornment';

import ClickableIcon from './clickableIcon.jsx';

export default function SearchField(props) {
  //this will be set depending on whether
  //the search icon was clicked or not
  let search = true;

  //missing all handle onClick and handle onChange

  return (
    <TextField
      placeholder={'Search'}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <ClickableIcon tooltip="Search">
              <Search color="inherit" fontSize="small" />
            </ClickableIcon>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <span>
              {!search && (
                <ClickableIcon tooltip="Clear search" disabled={true}>
                  <ClearIcon color="inherit" fontSize="small" />
                </ClickableIcon>
              )}
              {search && (
                <ClickableIcon tooltip="Clear search">
                  <ClearIcon color="secondary" fontSize="small" />
                </ClickableIcon>
              )}
            </span>
          </InputAdornment>
        ),
      }}
    />
  );
}
