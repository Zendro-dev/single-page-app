import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import { logoutRequest } from '../../store/actions';
import models from '../../routes/routes'
import MainSwitch from './MainSwitch'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ModelsIcon from '@material-ui/icons/BubbleChart';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Accounts from '@material-ui/icons/SupervisorAccountRounded';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
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
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbarLeftButtons: {
    marginLeft: 'auto',
  },
  hide: {
    display: 'none',
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
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  inline: {
    display: 'inline',
  },
}));

function MainPanel({ dispatch }) {
  const classes = useStyles();
  const theme = useTheme();
  const accountModels = [
    {
      id: -1,
      name: 'user',
      title: 'Users',
      url: '/main/admin/user',
    },
    {
      id: -2,
      name: 'role',
      title: 'Roles',
      url: '/main/admin/role',
    },
  ];
  const history = useHistory();
  const [openDrawer, setOpenDrawer] = useState(true);
  const [openModelsList, setOpenModelsList] = useState(true);
  const [modelsList, setModelsList] = useState(models);
  const [openAccountsList, setOpenAccountsList] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleModelsListClick = () => {
    setOpenModelsList(!openModelsList);
  };
  const handleAccountsListClick = () => {
    setOpenAccountsList(!openAccountsList);
  };

  return (
    <Fade in={true} timeout={500}>
      <div className={classes.root}>
        <CssBaseline />
        
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, openDrawer && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap>
              Cenzontle
            </Typography>

            <div className={classes.toolbarLeftButtons}>
              <Button
                color="inherit"
                onClick={() => {
                  dispatch(logoutRequest());
                  history.push("/login");
                }}
              >
                Logout
              </Button>
            </div>

          </Toolbar>
        </AppBar>
        
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={openDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >

          {/* Header */}  
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>

          {/* Menu */}
          <List>

            {/* Home */}
            <ListItem 
              button
              onClick={() => {
                setSelectedIndex(-3);
                history.push('/main/home');
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant='body1'
                      display='block'
                      noWrap={true}
                      color="textPrimary"
                    >
                      <b>Home</b>
                    </Typography>
                  </React.Fragment>
                } />
            </ListItem>
            
            <Divider />
          
            {/* Models */}
            <ListItem button onClick={handleModelsListClick}>
              <ListItemIcon><ModelsIcon /></ListItemIcon>
              <ListItemText primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant='body1'
                      display='block'
                      noWrap={true}
                      color="textPrimary"
                    >
                      <b>Models</b>
                    </Typography>
                  </React.Fragment>
                } />
              {openModelsList ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openModelsList} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {modelsList.map((model) => (
                  <ListItem 
                    button 
                    className={classes.nested} 
                    key={model.id+'-'+model.name}
                    selected={selectedIndex === model.id}
                    onClick={() => {
                      setSelectedIndex(model.id);
                      history.push(model.url);
                    }}
                  >
                    <ListItemText primary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant='body2'
                          display='block'
                          noWrap={true}
                          color="textPrimary"
                        >
                          {model.title}
                        </Typography>
                      </React.Fragment>
                    }/>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            <Divider />

          
            {/* Accounts */}
            <ListItem button onClick={handleAccountsListClick}>
              <ListItemIcon><Accounts /></ListItemIcon> 
              <ListItemText primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant='body1'
                      display='block'
                      noWrap={true}
                      color="textPrimary"
                    >
                      <b>Accounts</b>
                    </Typography>
                  </React.Fragment>
                } 
              /> 
              {openAccountsList ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openAccountsList} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {accountModels.map((model) => (
                  <ListItem
                    button
                    className={classes.nested}
                    key={model.id+'-'+model.name}
                    selected={selectedIndex === model.id}
                    onClick={() => {
                      setSelectedIndex(model.id);
                      history.push(model.url);
                    }}
                  >
                    <ListItemText primary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant='body2'
                          display='block'
                          noWrap={true}
                          color="textPrimary"
                        >
                          {model.title}
                        </Typography>
                      </React.Fragment>
                    }/>

                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Drawer>
        
        {/* Main */}
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: openDrawer,
          })}
        >
          <MainSwitch />

        </main>
      </div>
    </Fade>
  );
}

export default connect()(MainPanel)