import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  AppBar,
  Toolbar,
  Fade,
  IconButton,
  Button,
  Typography,
} from '@material-ui/core';
import { MenuOutlined as MenuIcon } from '@material-ui/icons';
import LanguageSwitcher from './LanguageSwitcher';

const useStyles = (topBarMargin) =>
  makeStyles((theme) => ({
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${topBarMargin}px)`,
      marginLeft: topBarMargin,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
      transition: theme.transitions.create(['width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    toolbarLeftButtons: {
      marginLeft: 'auto',
    },
    hide: {
      display: 'none',
    },
  }))();

export default function Topbar({
  isDrawerOpen,
  handleDrawerOpen,
  topBarMargin,
}) {
  const classes = useStyles(topBarMargin);

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isDrawerOpen,
      })}
    >
      <Toolbar>
        {/* EXPAND DRAWER BUTTON */}
        <Fade in={true} timeout={500}>
          <IconButton
            id="MainPanel-iconButton-openMenu"
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, isDrawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Fade>

        {!isDrawerOpen && (
          <Fade in={true} timeout={500}>
            <Typography variant="h5" display="block" noWrap={true}>
              Zendro
            </Typography>
          </Fade>
        )}

        <div className={classes.toolbarLeftButtons}>
          <LanguageSwitcher />
          {/* LOGOUT */}
          <Button
            id={'MainPanel-button-logout'}
            color="inherit"
            // onClick={() => {
            //   closeSnackbar();
            //   dispatch(logoutRequest());
            //   history.push("/login");
            // }}
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
