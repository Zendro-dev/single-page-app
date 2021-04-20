import { KeyboardEventHandler, ReactElement, useState } from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Backspace as ClearIcon,
  Search as SearchIcon,
} from '@material-ui/icons';

import { IconButton } from '@/components/buttons';

interface SearchFieldProps {
  onSearchClick: (value: string) => void;
}

export default function SearchField({
  onSearchClick,
}: SearchFieldProps): ReactElement {
  const [clearDisabled, setClearDisabled] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const classes = useStyles();

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
        className: classes.searchField,
        startAdornment: (
          <InputAdornment position="start">
            <IconButton tooltip="Search" onClick={searchClick}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              component="span"
              tooltip="Clear search"
              disabled={clearDisabled}
              onClick={clearClick}
            >
              <ClearIcon
                color={clearDisabled ? 'disabled' : 'secondary'}
                fontSize="small"
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
      onKeyPress={(event) => handleEnter(event)}
      onChange={(event) => handleSearchField(event.target.value)}
    />
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    searchField: {
      padding: theme.spacing(1, 0),
    },
  })
);
