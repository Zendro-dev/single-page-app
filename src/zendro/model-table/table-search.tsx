import { KeyboardEventHandler, ReactElement, useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Backspace as ClearIcon,
  Search as SearchIcon,
} from '@material-ui/icons';

import { IconButton } from '@/components/buttons';

import '@/i18n';
import { useTranslation } from 'react-i18next';

interface SearchFieldProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  value?: string;
  onReset?: () => void;
}

export default function SearchField({
  onSearch,
  placeholder,
  value,
  onReset,
}: SearchFieldProps): ReactElement {
  const [text, setText] = useState(value);
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    setText(value);
  }, [value, setText]);

  const searchIconClick: React.MouseEventHandler<HTMLButtonElement> = (): void => {
    if (text) search(text);
  };

  const search = (value: string): void => {
    onSearch(value);
  };

  const searchInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === 'Enter') {
      if (text) search(text);
    }
  };

  return (
    <TextField
      label={placeholder ?? t('model-table.search-label-default')}
      value={text}
      variant="outlined"
      className={classes.searchField}
      InputProps={{
        onKeyDown: searchInputKeyDown,
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              size="small"
              tooltip={t('model-table.search-tooltip')}
              onClick={searchIconClick}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: onReset && (
          <InputAdornment position="end">
            <IconButton
              component="span"
              size="small"
              tooltip={t('model-table.search-clear')}
              disabled={!value}
              onClick={onReset}
            >
              <ClearIcon
                color={!value ? 'disabled' : 'secondary'}
                fontSize="small"
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
      onChange={(event) => setText(event.target.value)}
    />
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    searchField: {
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(3, 0),
      },
    },
  })
);
