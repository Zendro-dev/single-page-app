import clsx from 'clsx';
import React from 'react';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import SiteLink from '@/components/site-link';
import TabMenu from './tab-menu';
import { SvgIconType } from '@/types/elements';

interface TabLink {
  type: 'link';
  label: string;
  href: string;
  icon?: SvgIconType;
}

interface TabGroup {
  type: 'group';
  label: string;
  links?: TabLink[];
}

export interface RecordLayoutProps {
  id: string;
  tabs: (TabGroup | TabLink)[];
  active?: string;
}

export default function NavigationTabs(
  props: React.PropsWithChildren<RecordLayoutProps>
): React.ReactElement {
  const classes = useStyles();

  return (
    <nav aria-label={props.id} className={classes.nav}>
      <ul className={classes.list}>
        {props.tabs.map((tab) =>
          tab.type === 'link' ? (
            <li
              key={tab.label}
              className={clsx({
                ['TabLinkActive']: tab.href === props.active,
              })}
            >
              <SiteLink color="inherit" underline="none" href={tab.href}>
                {tab.label}
              </SiteLink>
            </li>
          ) : (
            <TabMenu
              key={tab.label}
              label={tab.label}
              links={tab.links}
              selected={props.active}
              ButtonProps={{
                id: `${props.id}-menu-button`,
                className: clsx({
                  ['TabLinkActive']: tab.links?.some(
                    (link) => link.href === props.active
                  ),
                }),
              }}
              MenuProps={{
                id: `${props.id}-menu`,
                className: classes.tabMenu,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
              }}
            />
          )
        )}
      </ul>
    </nav>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nav: {
      marginBottom: theme.spacing(6),
    },
    list: {
      // CSS reset
      listStyle: 'none',
      margin: 0,
      padding: 0,

      // Layout
      display: 'flex',
      justifyContent: 'space-between',

      // Colors
      borderBottom: '1px solid',
      borderBottomColor: theme.palette.divider,

      // Items
      '& li, button': {
        // Base
        ...theme.typography.button,
        borderRadius: 0,

        // Layout
        display: 'flex',
        flexGrow: 1,

        // Font & Colors
        color: theme.palette.grey[700],
        backgroundColor: theme.palette.action.hover,
        textTransform: 'uppercase',

        '& a': {
          // Layout
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'center',

          // Spacing
          padding: theme.spacing(3, 2),
        },
      },

      '& li:hover:not(.TabLinkActive), button:hover:not(.TabLinkActive)': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.getContrastText(theme.palette.background.default),
      },

      '& li.TabLinkActive, button.TabLinkActive': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
        fontWeight: 'bold',
      },
    },
    tabMenu: {
      '& li': {
        // Base
        ...theme.typography.button,
        padding: 0,

        '& a': {
          display: 'flex',
          justifyContent: 'center',
          flexGrow: 1,

          color: theme.palette.grey[800],

          padding: theme.spacing(3, 2),
          '& svg': {
            color: theme.palette.grey[700],
            marginRight: theme.spacing(2),
          },
        },
      },
    },
  })
);
