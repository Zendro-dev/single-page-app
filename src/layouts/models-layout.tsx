import React, { PropsWithChildren, ReactElement, useState } from 'react';
import Link from 'next/link';

import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import {
  AppBar,
  Box,
  Drawer,
  Collapse,
  Divider,
  Fab,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  TypographyProps,
  Zoom,
} from '@material-ui/core';

import {
  BubbleChart as ModelsIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  HomeOutlined as HomeIcon,
  Menu as MenuIcon,
  SupervisorAccountRounded as AdminIcon,
} from '@material-ui/icons';

import LanguageSwitcher from '@/components/toolbar/lang-switcher';
import LogoutButton from '@/components/toolbar/logout-button';

import { SvgIconType } from '@/types/elements';
import { AppRoutes } from '@/types/routes';

interface ModelsDesktopLayoutProps {
  brand: string;
  routes: AppRoutes;
}

interface NavGroupProps {
  icon: SvgIconType;
  label: string;
}

interface NavLinkProps {
  className?: string;
  href: string;
  icon?: SvgIconType;
  text: string;
  textProps?: TypographyProps;
}

function NavGroup({
  icon: Icon,
  label,
  children,
}: PropsWithChildren<NavGroupProps>): ReactElement {
  const [showGroup, setShowGroup] = useState(true);
  return (
    <List disablePadding>
      <Divider />
      <ListItem
        component="button"
        button
        onClick={() => setShowGroup((state) => !state)}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={<Typography fontWeight="bold">{label}</Typography>}
        />
        {children && (showGroup ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </ListItem>
      <Collapse in={showGroup} timeout="auto" unmountOnExit>
        <List disablePadding>{children}</List>
      </Collapse>
    </List>
  );
}

function NavLink({
  className,
  href,
  icon: Icon,
  text,
  textProps,
}: NavLinkProps): ReactElement {
  return (
    <Link href={href} passHref>
      <ListItem className={className ?? ''} component="a" button>
        {Icon && (
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText
          primary={<Typography {...textProps}>{text}</Typography>}
        />
      </ListItem>
    </Link>
  );
}

export default function ModelsDashboard({
  brand,
  routes,
  children,
}: PropsWithChildren<ModelsDesktopLayoutProps>): ReactElement {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerOpen = (open: boolean) => (): void => setDrawerOpen(open);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen(true)}
            edge="start"
            className={clsx(
              classes.appBarMenuButton,
              drawerOpen && classes.appBarMenuButtonHide
            )}
          >
            <MenuIcon />
          </IconButton>
          {!drawerOpen && (
            <Fade in={true} timeout={500}>
              <Typography variant="h6" noWrap>
                {brand}
              </Typography>
            </Fade>
          )}

          <div className={classes.appBarRightButtonsContainer}>
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Typography
          className={classes.drawerHeader}
          component="h1"
          variant="h5"
        >
          {brand}
        </Typography>

        {drawerOpen && (
          <Box position="fixed" top={8} left={256} zIndex="modal">
            <Zoom in={true} timeout={500}>
              <Fab
                size="medium"
                color="primary"
                onClick={handleDrawerOpen(false)}
              >
                <ChevronLeftIcon />
              </Fab>
            </Zoom>
          </Box>
        )}

        <NavLink
          href="/home"
          icon={HomeIcon}
          text="Home"
          textProps={{
            fontWeight: 'bold',
          }}
        />

        {routes && (
          <NavGroup icon={ModelsIcon} label="Models">
            {routes.models.map(({ name, href }) => (
              <NavLink
                key={name}
                href={href}
                className={classes.linkText}
                text={name}
              />
            ))}
          </NavGroup>
        )}

        <NavGroup icon={AdminIcon} label="Admin">
          {routes?.admin.map(({ name, href }) => (
            <NavLink
              key={name}
              className={classes.linkText}
              href={href}
              text={name}
            />
          ))}
        </NavGroup>
      </Drawer>

      <main
        className={clsx(classes.mainContent, {
          [classes.mainContentShift]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => {
  const drawerWidth = 280;
  return createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    appBarMenuButton: {
      marginRight: theme.spacing(2),
    },
    appBarMenuButtonHide: {
      display: 'none',
    },
    appBarRightButtonsContainer: {
      marginLeft: 'auto',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    linkText: {
      paddingLeft: theme.spacing(8),
    },
    mainContent: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
      width: '100%',
    },
    mainContentShift: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      width: `calc(100% - ${drawerWidth}px)`,
    },
  });
});
