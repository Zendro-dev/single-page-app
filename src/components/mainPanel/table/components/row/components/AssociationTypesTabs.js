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

export default function AssociationTypesTabs(props) {
    /*
      Properties
    */
    const {
        toOnesLength,
        toManysLength,
        associationTypeSelected,
        classes,
        onChange,
    } = props;

    /*
      Render
    */
    return (
        <Tabs
            orientation="vertical"
            variant="scrollable"
            value={associationTypeSelected}
            className={classes.vtabs}
            onChange={onChange}
        >
            <Tab
                id='tab-to-one'
                key={0}
                value={0}
                className={classes.associationTypeTab}
                label={
                    <Badge className={classes.badgePadding} color='secondary' badgeContent={toOnesLength}>
                        To-One
            </Badge>
                }
            />
            <Tab
                id='tab-to-many'
                key={1}
                value={1}
                className={classes.associationTypeTab}
                label={
                    <Badge className={classes.badgePadding} color={(associationTypeSelected === 1) ? 'secondary' : 'default'} badgeContent={toManysLength}>
                        To-Many
            </Badge>
                }
            />
        </Tabs>
    )
}