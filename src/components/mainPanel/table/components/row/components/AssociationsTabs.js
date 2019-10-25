import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

/*
  Material-UI components
*/
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Badge from '@material-ui/core/Badge';

/** 
   * ASSOCIATION TABS 
   */
export default function AssociationTabs(props) {
    /*
      Properties
    */
    const { toOnes, toManys, associationTypeSelected, classes } = props;
    /*
      State
    */
    const [toOneSelected, setToOneSelected] = useState(0);
    const [toManySelected, setToManySelected] = useState(0);
    const [ready, setReady] = useState(false);

    /*
      Effect
    */
    useEffect(() => {
        console.log("ready: ok");
        setReady(true);
        return function cleanup() { setReady(false) };
    }, []);

    /*
      Render
    */
    return (

        <div>
            {/* 
            Case 0: toOnes
              Nested Tabs 
          */}
            {(associationTypeSelected === 0) && (
                <Grow in={ready}>
                    <Tabs
                        className={classes.tabs}
                        value={toOneSelected}
                        // onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {(toOnes.length > 0) ?
                            /*
                              Case: There are associations
                            */
                            (toOnes.map((item, index) => {
                                return (
                                    <Tab
                                        label={item.relationNameCp}
                                        key={item.relationNameCp + index}
                                        value={index}
                                        className={classes.associationTypeTab}
                                    // onClick={props.onClick} 
                                    />
                                )
                            })) :
                            /*
                              Case: There are no associations
                            */
                            (
                                <Tab
                                    label={"There are no to-one associations"}
                                    disabled={true}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    className={classes.associationTypeTab}
                                />
                            )
                        }
                    </Tabs>
                </Grow>
            )}

            {/* 
            Case 1: toManys
              Nested Tabs 
          */}
            {(associationTypeSelected === 1) && (
                <Grow in={ready}>
                    <Tabs
                        className={classes.tabs}
                        value={toManySelected}
                        // onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"

                    >
                        {(toManys.length > 0) ?
                            /*
                              Case: There are associations
                            */
                            (toManys.map((item, index) => {
                                return (
                                    <Tab
                                        label={item.relationNameCp}
                                        key={item.relationNameCp + index}
                                        value={index}
                                        className={classes.associationTypeTab}
                                    // onClick={props.onClick} 
                                    />
                                )
                            })) :
                            /*
                              Case: There are no associations
                            */
                            (
                                <Tab
                                    label={"There are no to-many associations"}
                                    disabled={true}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    className={classes.associationTypeTab}
                                />
                            )
                        }
                    </Tabs>
                </Grow>
            )}
        </div>

    );
}