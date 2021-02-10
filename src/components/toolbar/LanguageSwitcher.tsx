import { ReactElement } from 'react';
import { useRef, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import Translate from '@material-ui/icons/TranslateRounded';

export default function LanguageSwitcher(): ReactElement {
  const [translationAnchorEl, setTranslationAnchorEl] = useState<
    EventTarget & HTMLButtonElement
  >();

  const handleTranslationIconClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setTranslationAnchorEl(event.currentTarget);
  };

  const handleTranslationMenuClose = () => {
    setTranslationAnchorEl(undefined);
  };

  const translations = useRef([
    { language: 'Español', lcode: 'es-MX' },
    { language: 'English', lcode: 'en-US' },
    { language: 'Deutsch', lcode: 'de-DE' },
  ]);
  const classes = useStyles();
  return (
    <>
      {/* Translate.icon */}
      <Tooltip title="Change language">
        <IconButton
          id={'MainPanel-iconButton-translate'}
          color="inherit"
          onClick={handleTranslationIconClick}
        >
          <Translate fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Translate.menu */}
      <Menu
        anchorEl={translationAnchorEl}
        keepMounted
        open={Boolean(translationAnchorEl)}
        onClose={handleTranslationMenuClose}
      >
        {translations.current.map((translation, index) => (
          <MenuItem
            id={'MainPanel-menuItem-translation-' + translation.lcode}
            className={classes.translationMenuItem}
            key={translation.lcode}
          >
            <Typography variant="inherit" display="block" noWrap={true}>
              {translation.language}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    translationMenuItem: {
      margin: theme.spacing(1),
    },
  })
);
