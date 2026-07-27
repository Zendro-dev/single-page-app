import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { TranslateRounded as TranslateIcon } from '@mui/icons-material';
import ClientOnly from '@/components/client-only';

// Static data, never mutated after this module loads - no need for a ref.
const translations = [
  { language: 'Español', lcode: 'es-MX' },
  { language: 'English', lcode: 'en-US' },
  { language: 'Deutsch', lcode: 'de-DE' },
];

export default function LanguageSwitcher(props: IconButtonProps): ReactElement {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const [translationAnchorEl, setTranslationAnchorEl] = useState<
    EventTarget & HTMLButtonElement
  >();

  const handleTranslationMenuItemClick = (index: number): void => {
    setTranslationAnchorEl(undefined);
    i18n.changeLanguage(translations[index].lcode);
  };

  const handleTranslationIconClick: React.MouseEventHandler<
    HTMLButtonElement
  > = (event) => {
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
      <ClientOnly>
        <Tooltip title={t('toolbar.change-language') ?? ''}>
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
      </ClientOnly>

      {/* Translate.menu */}
      <Menu
        id="language-switcher-menu"
        slotProps={{
          list: {
            'aria-labelledby': 'language-switcher-button',
          },
        }}
        anchorEl={translationAnchorEl}
        className={classes.translationMenu}
        keepMounted
        open={Boolean(translationAnchorEl)}
        onClose={handleTranslationMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {translations.map((translation, index) => (
          <MenuItem
            id={translation.lcode}
            className={classes.translationMenuItem}
            key={translation.lcode}
            onClick={() => handleTranslationMenuItemClick(index)}
          >
            <Typography
              variant="inherit"
              sx={{ display: 'block' }}
              noWrap={true}
            >
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
