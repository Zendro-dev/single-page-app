import { ReactElement } from 'react';
import { useRef, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { TranslateRounded as TranslateIcon } from '@material-ui/icons';
import i18n from '../../i18n';

export default function LanguageSwitcher(props: IconButtonProps): ReactElement {
  const classes = useStyles();

  const translations = useRef([
    { language: 'Español', lcode: 'es-MX' },
    { language: 'English', lcode: 'en-US' },
    { language: 'Deutsch', lcode: 'de-DE' },
  ]);

  const [translationAnchorEl, setTranslationAnchorEl] = useState<
    EventTarget & HTMLButtonElement
  >();

  const handleTranslationMenuItemClick = (index: number): void => {
    setTranslationAnchorEl(undefined);
    i18n.changeLanguage(translations.current[index].lcode);
  };

  const handleTranslationIconClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    setTranslationAnchorEl(event.currentTarget);
  };

  const handleTranslationMenuClose: React.MouseEventHandler<
    HTMLButtonElement | HTMLLIElement
  > = (): void => {
    setTranslationAnchorEl(undefined);
  };

  return (
    <>
      {/* Translate.icon */}
      <Tooltip title="Change language">
        <IconButton
          {...props}
          id="language-switcher-button"
          aria-controls="language-switcher-menu"
          aria-haspopup="true"
          aria-expanded={translationAnchorEl ? 'true' : undefined}
          onClick={handleTranslationIconClick}
        >
          <TranslateIcon />
        </IconButton>
      </Tooltip>

      {/* Translate.menu */}
      <Menu
        id="language-switcher-menu"
        MenuListProps={{
          'aria-labelledby': 'language-switcher-button',
        }}
        anchorEl={translationAnchorEl}
        className={classes.translationMenu}
        keepMounted
        open={Boolean(translationAnchorEl)}
        onClose={handleTranslationMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {translations.current.map((translation, index) => (
          <MenuItem
            id={translation.lcode}
            className={classes.translationMenuItem}
            key={translation.lcode}
            onClick={() => handleTranslationMenuItemClick(index)}
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
    translationMenu: {
      marginTop: theme.spacing(2),
    },
    translationMenuItem: {
      margin: theme.spacing(1, 1, 1, 1),
    },
  })
);
