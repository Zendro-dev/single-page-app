import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { logoutRequest } from '../../store/actions.js';
import { useHistory } from "react-router-dom";

/*
  Material-UI components
*/
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import CircleIcon from '@material-ui/icons/FiberManualRecordOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

//components
import StackView from './StackView'

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
    const classes = useStyles();
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(true);
    const [openModelsList, setOpenModelsList] = useState(true);
    const [modelsList, setModelsList] = useState([]);
    const [openAdminList, setOpenAdminList] = useState(true);
    const adminList = [ 'user', 'role', 'role_to_user' ];
    let history = useHistory();

    //hook:
    useEffect(() => {
        /*
          Get model list
        */
       console.debug("onUseEffect: ok")
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
                                    <CircleIcon color="primary"/>
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
                    <ListItemIcon>
                        <ModelsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                    {openAdminList ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openAdminList} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {adminList.map((text, index) => (
                            <ListItem button className={classes.nested} key={text}>
                                <ListItemIcon>
                                    <CircleIcon color="primary"/>
                                </ListItemIcon>
                                <ListItemText primary={text} />
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
                    StackView
                */}
                <StackView />
            </main>
        </div>
    );
}

/*
  Methods
*/


/*
  Make connection
*/
export default connect()(MainPanel)