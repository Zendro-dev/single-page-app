import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { logoutRequest, onRefresh } from '../../store/actions';
import { useSnackbar } from 'notistack';
import routes from '../../routes/routes'
import MainSwitch from './MainSwitch'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Collapse from '@material-ui/core/Collapse';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ModelsIcon from '@material-ui/icons/BubbleChart';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Accounts from '@material-ui/icons/SupervisorAccountRounded';
import Translate from '@material-ui/icons/TranslateRounded';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';

const drawerWidth = 280;
const appBarHeight = 72;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    height: appBarHeight,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    height: appBarHeight,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  cenzBox: {
    width: drawerWidth,
    marginLeft: -drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  cenzBoxShift: {
    width: drawerWidth,
    marginLeft: 0,
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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    height: `calc(100% - ${appBarHeight}px)`,
    marginTop: appBarHeight,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    width:'100%'
  },
  contentShift: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    width: `calc(100% - ${drawerWidth}px)`,
  },
  cenzTitle: {
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  inline: {
    display: 'inline',
  },
  translationMenuItem: {
    margin: theme.spacing(1),
  },
  notiErrorActionText: {
    color: '#eba0a0',
  },
}));

export default function MainPanel(props) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();

  const dispatch = useDispatch();
  const loginStatus = useSelector(state => state.login.loginStatus);
  const user = useSelector(state => state.login.user);
  const userRoles = useSelector(state => state.login.userRoles);
  const acl = useSelector(state => state.login.acl);
  const aclModuleStatusErrors = useSelector(state => state.aclModuleStatus.errors);
  
  const [openDrawer, setOpenDrawer] = useState(true);
  const [openModelsList, setOpenModelsList] = useState(true);
  const [openAdminModelsList, setOpenAdminModelsList] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const modelsList = useRef(routes().models);
  const adminModelsList = useRef(routes().adminModels);
  const [permissions, setPermissions] = useState(null);

  const [translationAnchorEl, setTranslationAnchorEl] = React.useState(null);
  const [translationSelectedIndex, setTranslationSelectedIndex] = React.useState(-1);
  const translations = useRef([
    {language: 'Español', lcode: 'es-MX'},
    {language: 'English', lcode: 'en-US'},
    {language: 'Deutsch', lcode: 'de-DE'},
  ]);

  const actionText = useRef(null);
  const action = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' className={classes.notiErrorActionText} onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  ));

  useEffect(() => {}, []);

  useEffect(() => {
    //set selected translation
    for(var i=0; i<translations.current.length; i++)
    {
      if(translations.current[i].lcode === i18n.language) {
        setTranslationSelectedIndex(i);
        break;
      }
    }
  }, [i18n.language]);

  useEffect(() => {
    //check acl module status
    if(aclModuleStatusErrors&&Array.isArray(aclModuleStatusErrors)&&aclModuleStatusErrors.length>0) {
      actionText.current = t('modelPanels.gotIt', "Got it");
      enqueueSnackbar( t('login.errors.e7', "ACL module could not be implemented. Please contact your administrator."), {
        variant: 'error',
        preventDuplicate: false,
        persist: true,
        action: action.current,
      });
    }
  }, [aclModuleStatusErrors, enqueueSnackbar, t]);

  useEffect(() => {
    if(loginStatus === "refreshed") {
      dispatch(onRefresh());
    } else if(loginStatus === "expired") {
      dispatch(logoutRequest());
    }
  }, [loginStatus, dispatch]);

  useEffect(() => {
    if(acl) {
      if( modelsList&&modelsList.current&&Array.isArray(modelsList.current) &&
        adminModelsList&&adminModelsList.current&&Array.isArray(adminModelsList.current)) {
          
          let m = modelsList.current.map((model)=>{return model.name});
          let am = adminModelsList.current.map((model)=>{return model.name});
                 
          acl.allowedPermissions(user, am.concat(m), function(err, permissions) {
            if(!err) {
              setPermissions(permissions);
            }
          })
      }
    }
  }, [acl, user]);

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
    setOpenAdminModelsList(!openAdminModelsList);
  };

  const handleTranslationIconClick = event => {
    setTranslationAnchorEl(event.currentTarget);
  };

  const handleTranslationMenuItemClick = (event, index) => {
    setTranslationAnchorEl(null);
    
    i18n.changeLanguage(translations.current[index].lcode, (err, t) => {
      if(err) {
        //"An error occurred while trying load language."
        enqueueSnackbar( t('mainPanel.errors.e1'), {
          variant: 'info',
          preventDuplicate: false,
          persist: false,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
        console.log('Error loading languaje: ', err);
      } else {
        closeSnackbar();
      }
    });
  };

  const handleTranslationMenuClose = () => {
    setTranslationAnchorEl(null);
  };

  return (
    <Fade in={true} timeout={500}>
      <div className={classes.root}>
        <CssBaseline />

        {/* Drawer menu header */}
     
          
            <Box
              className={clsx(classes.cenzBox, {
                [classes.cenzBoxShift]: openDrawer,
              })}
              // width={drawerWidth}
              height={appBarHeight}
              bgcolor="background.paper"
              position="fixed"
              top={0}
              left={0}
              zIndex="modal"
            >
              {/* Cenzontle */} 
              <Typography className={classes.cenzTitle} variant="h5" display='block' noWrap={true}>
                Cenzontle
              </Typography>
            </Box>
          
        
        {(openDrawer) ?
          <Fade in={true} timeout={700}>
            <Box
              className={clsx(classes.cenzBox, {
                [classes.cenzBoxShift]: openDrawer,
              })}
              position="fixed"
              top={appBarHeight}
              left={0}
              zIndex="modal"
            >
              <Divider/>
            </Box>
          </Fade> : null
        }
        {/* Icon: close menu */}
        {(openDrawer) ?
            <Box
              position="fixed"
              top={8}
              left={256}
              zIndex="modal"
            >
              <Zoom in={true} timeout={500}>
                <Fab
                  size="medium"
                  color="primary"
                  onClick={handleDrawerClose}
                >
                  <ChevronLeftIcon />
                </Fab> 
              </Zoom>
            </Box> : null
        }
        
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar>

            {/* Menu.icon */}
            {(!openDrawer) ?
              <Fade in={true} timeout={500}>
                <IconButton
                  color="inherit"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, openDrawer && classes.hide)}
                > <MenuIcon />
                </IconButton>
              </Fade> : null
            }
            
            {/* Cenzontle */}
            {(!openDrawer) ?
              <Fade in={true} timeout={500}>
                <Typography variant="h5" display='block' noWrap={true}>
                  Cenzontle
                </Typography>
              </Fade> : null
            }

            <div className={classes.toolbarLeftButtons}>

              {/* Translate.icon */}
              <Tooltip title={ t('mainPanel.translate') }>
                <IconButton 
                  color="inherit"
                  onClick={handleTranslationIconClick}
                >
                  <Translate fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Translate.menu*/}
              <Menu
                anchorEl={translationAnchorEl}
                keepMounted
                open={Boolean(translationAnchorEl)}
                onClose={handleTranslationMenuClose}
              >
                {translations.current.map((translation, index) => (
                  <MenuItem
                    className={classes.translationMenuItem}
                    key={translation.lcode}
                    selected={index === translationSelectedIndex}
                    onClick={event => handleTranslationMenuItemClick(event, index)}
                  >
                    <Typography variant="inherit" display='block' noWrap={true}>
                      {translation.language}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>

              {/* Logout */} 
              <Button
                color="inherit"
                onClick={() => {
                  closeSnackbar();
                  dispatch(logoutRequest());
                  history.push("/login");
                }}
              >
                { t('mainPanel.logout') }
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
                      <b>{ t('mainPanel.home') }</b>
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
                      <b>{ t('mainPanel.models') }</b>
                    </Typography>
                  </React.Fragment>
                } />
              {openModelsList ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={openModelsList} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {modelsList.current.map((model) => (
                  
                  /* acl check */
                  (permissions&&(permissions[model.name].includes('read') || permissions[model.name].includes('*'))) ? (
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
                  ) : null

                ))}
              </List>
            </Collapse>

            <Divider />

            {/* Admin */}
            {/* acl check */}
            {(userRoles&&Array.isArray(userRoles)&&userRoles.includes('admin')) && (
              <div>
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
                          <b>{ t('mainPanel.admin') }</b>
                        </Typography>
                      </React.Fragment>
                    } 
                  /> 
                  {openAdminModelsList ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openAdminModelsList} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {adminModelsList.current.map((model) => (

                      /* acl check */
                      (permissions&&(permissions[model.name].includes('*'))) ? (
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
                      ) : null

                    ))}
                  </List>
                </Collapse>
              </div>
            )}
          </List>
        </Drawer>
        
        {/* Main */}
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: openDrawer,
          })}
        >
          <MainSwitch permissions={permissions}/>
        </main>
      </div>
    </Fade>
  );
}
