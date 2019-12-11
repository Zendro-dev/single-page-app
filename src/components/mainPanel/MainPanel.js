import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { logoutRequest } from '../../store/actions';
import { useSnackbar } from 'notistack';
import routes from '../../routes/routes'
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
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
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
  nested: {
    paddingLeft: theme.spacing(4),
  },
  inline: {
    display: 'inline',
  },
  translationMenuItem: {
    margin: theme.spacing(1),
  },
}));

function MainPanel({ dispatch }) {
  const classes = useStyles();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();

  const [openDrawer, setOpenDrawer] = useState(true);
  const [openModelsList, setOpenModelsList] = useState(true);
  const [openAdminModelsList, setOpenAdminModelsList] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const modelsList = useRef(routes().models);
  const adminModelsList = useRef(routes().adminModels);

  const [translationAnchorEl, setTranslationAnchorEl] = React.useState(null);
  const [translationSelectedIndex, setTranslationSelectedIndex] = React.useState(-1);
  const translations = [
    {language: 'Español', lcode: 'es-MX'},
    {language: 'English', lcode: 'en-US'},
  ];

  useEffect(() => {
    for(var i=0; i<translations.length; i++)
    {
      if(translations[i].lcode = i18n.language) {
        setTranslationSelectedIndex(i);
        break;
      }
    }
  }, []);

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
    setTranslationSelectedIndex(index);
    setTranslationAnchorEl(null);

    i18n.changeLanguage(translations[index].lcode, (err, t) => {
      if(err) {
        //"An error occurred while trying load language."
        enqueueSnackbar( t('mainPanel.errors.e1'), {
          variant: 'info',
          preventDuplicate: true,
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
        
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar>

            {/* Menu.icon */}
            <IconButton
              color="inherit"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, openDrawer && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Cenzontle */} 
            <Typography variant="h6" noWrap>
              Cenzontle
            </Typography>

            <div className={classes.toolbarLeftButtons}>

              {/* Translate.icon */}
              <Tooltip title={ t('mainPanel.translate') }>
                <IconButton 
                  color="inherit"
                  onClick={event => handleTranslationIconClick(event)}
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
                {translations.map((translation, index) => (
                  <MenuItem
                    className={classes.translationMenuItem}
                    key={translation.lcode}
                    selected={index === translationSelectedIndex}
                    onClick={event => handleTranslationMenuItemClick(event, index)}
                  >
                    <Typography variant="inherit" noWrap>
                      {translation.language}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>

              {/* Logout */} 
              <Button
                color="inherit"
                onClick={() => {
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