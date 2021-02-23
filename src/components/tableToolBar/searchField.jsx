import { useState } from 'react';
import { TextField } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Backspace';
import InputAdornment from '@material-ui/core/InputAdornment';

import ClickableIcon from './clickableIcon.jsx';

export default function SearchField(props) {
  const [clearDisabled, setClearDisabled] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const searchClick = () => {
    if (searchValue !== '') setClearDisabled(false);
    props.onSearchClick(searchValue);
  };

  const clearClick = () => {
    setSearchValue('');
    setClearDisabled(true);
    props.onSearchClick('');
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      searchClick();
    }
  };

  const handleSearchField = (value) => {
    setSearchValue(value);
  };

  return (
    <TextField
      placeholder={'Type your search'}
      value={searchValue}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <ClickableIcon tooltip="Search" handleOnClick={searchClick}>
              <Search color="inherit" fontSize="small" />
            </ClickableIcon>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <ClickableIcon
              tooltip="Clear search"
              disabled={clearDisabled}
              handleOnClick={clearClick}
            >
              <ClearIcon
                color={clearDisabled ? 'inherit' : 'secondary'}
                fontSize="small"
              />
            </ClickableIcon>
          </InputAdornment>
        ),
      }}
      onKeyPress={(event) => handleEnter(event)}
      onChange={(event) => handleSearchField(event.target.value)}
    />
  );
}
