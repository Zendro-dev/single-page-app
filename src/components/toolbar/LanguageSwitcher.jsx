import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import Translate from '@material-ui/icons/TranslateRounded';

const useStyles = makeStyles((theme) => ({
  translationMenuItem: {
    margin: theme.spacing(1),
  },
}));

export default function LanguageSwitcher() {
  const [translationAnchorEl, setTranslationAnchorEl] = React.useState(null);

  const handleTranslationIconClick = (event) => {
    setTranslationAnchorEl(event.currentTarget);
  };

  const handleTranslationMenuClose = () => {
    setTranslationAnchorEl(null);
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
            // selected={index === translationSelectedIndex}
            // onClick={event => handleTranslationMenuItemClick(event, index)}
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
