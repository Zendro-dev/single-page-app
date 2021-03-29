import { KeyboardEventHandler, ReactElement, useState } from 'react';
import { TextField } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Backspace';
import InputAdornment from '@material-ui/core/InputAdornment';

import ClickableIcon from '../buttons/icon-button';

interface SearchFieldProps {
  onSearchClick: (value: string) => void;
}

export default function SearchField({
  onSearchClick,
}: SearchFieldProps): ReactElement {
  const [clearDisabled, setClearDisabled] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const searchClick = (): void => {
    if (searchValue !== '') setClearDisabled(false);
    onSearchClick(searchValue);
  };

  const clearClick = (): void => {
    setSearchValue('');
    setClearDisabled(true);
    onSearchClick('');
  };

  const handleEnter: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      searchClick();
    }
  };

  const handleSearchField = (value: string): void => {
    setSearchValue(value);
  };

  return (
    <TextField
      placeholder={'Type your search'}
      value={searchValue}
      variant="standard"
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
