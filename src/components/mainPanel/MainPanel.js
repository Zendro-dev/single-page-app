import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { logoutRequest } from '../../store/actions.js';
import { useHistory } from "react-router-dom";
import MainSwitch from './MainSwitch'

/*
  Material-UI components
*/
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
//import ModelsIcon from '@material-ui/icons/SelectAllOutlined';
import ModelsIcon from '@material-ui/icons/BubbleChart';
import CircleIconOutlined from '@material-ui/icons/FiberManualRecordOutlined';
import CircleIconFilled from '@material-ui/icons/FiberManualRecord';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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
}));

/*
    Component: MainPanel
*/
function MainPanel({ dispatch }) {
  /*
    Properties
  */
  const classes = useStyles();
  const theme = useTheme();
  const adminItems = [
    {
      id: 0,
      title: 'user',
      url: '/main/admin/user',
    },
    {
      id: 1,
      title: 'role',
      url: '/main/admin/role',
    }
  ];
  let history = useHistory();

  /*
    State
  */
  const [openDrawer, setOpenDrawer] = useState(true);
  const [openModelsList, setOpenModelsList] = useState(true);
  const [modelsList, setModelsList] = useState([]);
  const [openAdminList, setOpenAdminList] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);


  //hook:
  useEffect(() => {
    //this hook behaves as componentDidMount()

    /*
      Get model list

      //this would not be needed as table models will be generated.
    */
    console.debug("onUseEffect: ok");
    console.log("@props.history: ", history);

    updateModelList();
  }, []);

  /*
    Handlers
  */
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleModelsListClick = () => {
    setOpenModelsList(!openModelsList);
  };
  const handleAdminListClick = () => {
    setOpenAdminList(!openAdminList);
  };

  /*
    Methods
  */
  function updateModelList() {
    setModelsList(['Model1', 'Model2', 'Model3']);
  }

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
            
            {/* 
              Button: Menu Open/Close 
            */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, openDrawer && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            
            {/* 
              Title 
            */}
            <Typography variant="h6" noWrap>
              Cenzontle
            </Typography>

            <div className={classes.toolbarLeftButtons}>
              {/* 
                Button: Logout 
              */}
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
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>
          </List>
          <Divider />
          <ListItem button onClick={handleModelsListClick}>
            <ListItemIcon>
              <ModelsIcon />
            </ListItemIcon>
            <ListItemText primary="Models" />
            {openModelsList ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openModelsList} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {modelsList.map((text, index) => (
                <ListItem button className={classes.nested} key={text}>
                  <ListItemIcon>
                    <CircleIconOutlined color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <Divider />

          {/* 
                    Admin List 
                */}
          <ListItem button onClick={handleAdminListClick}>

            {/* 
                        Icon 
                    */}
            <ListItemIcon>
              <ModelsIcon />
            </ListItemIcon>
            {/* 
                        List Item Text & Expand Indicator 
                    */}
            <ListItemText primary="Admin" /> {openAdminList ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          {/* 
                    Collapsing List 
                */}
          <Collapse in={openAdminList} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              {/*
                            Map ListItems 
                        */}
              {adminItems.map((item) => (
                /*
                  Item
                */
                <ListItem
                  button
                  className={classes.nested}
                  key={item.id}
                  onClick={() => {

                    //set selected index
                    setSelectedIndex(item.id);

                    //push item's url
                    console.log("@pushing: ", item.url);
                    history.push(item.url);

                  }}
                  selected={selectedIndex === item.id}
                >
                  {/*
                                    Item.Icon 
                                */}
                  <ListItemIcon>
                    {
                      (selectedIndex === item.id) ?
                        <CircleIconFilled color="primary" /> :
                        <CircleIconOutlined />
                    }
                  </ListItemIcon>
                  {/*
                                    Item.Text
                                */}
                  <ListItemText primary={item.title} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: openDrawer,
          })}
        >
          {/*
                    MainSwitch
                */}
          <MainSwitch />
        </main>
      </div>
    </Fade>
  );
}

/*
  Methods
*/


/*
  Make connection
*/
export default connect()(MainPanel)