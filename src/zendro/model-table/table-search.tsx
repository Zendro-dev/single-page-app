import { KeyboardEventHandler, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputAdornment, TextField } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  Backspace as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import IconButton from '@/components/icon-button';

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

  // Keep the locally-editable `text` in sync with the `value` prop without
  // an effect: React handles a setState call during render (guarded by a
  // tracked "previous" comparison) as a single extra render pass rather
  // than a commit-then-effect-then-recommit cascade.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setText(value);
  }

  const searchIconClick: React.MouseEventHandler<
    HTMLButtonElement
  > = (): void => {
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
      data-cy="model-table-search-field"
      slotProps={{
        input: {
          onKeyDown: searchInputKeyDown,
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                size="small"
                tooltip={t('model-table.search-tooltip')}
                onClick={searchIconClick}
                data-cy="model-table-search-button"
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
                data-cy="model-table-search-reset"
              >
                <ClearIcon
                  color={!value ? 'disabled' : 'secondary'}
                  fontSize="small"
                />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      onChange={(event) => setText(event.target.value)}
    />
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchField: {
      '& .MuiOutlinedInput-input': {
        padding: theme.spacing(3, 0),
      },
    },
  })
);
