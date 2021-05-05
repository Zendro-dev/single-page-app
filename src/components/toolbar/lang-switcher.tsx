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
import { useTranslation } from 'react-i18next';
import '@/i18n';
// import i18n from '../../i18n/i18n';

export default function LanguageSwitcher(): ReactElement {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

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
      <Tooltip title={t('toolbar.change-language')}>
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
    translationMenuItem: {
      margin: theme.spacing(1),
    },
  })
);
