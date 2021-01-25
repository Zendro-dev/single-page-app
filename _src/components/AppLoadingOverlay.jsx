import React from 'react';

import {
  Box,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import {
  withStyles
} from '@material-ui/core/styles';


class AppLoadingOverlay extends React.Component {

  render () {
    return (
      <Box
        className={ this.props.classes.root }
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
        <Typography component="div" >
          <Box
            fontWeight="fontWeightBold"
            marginTop={ 2 }
            style={{ textTransform: 'uppercase' }}
          >
            { this.props.text }
          </Box>
        </Typography>
      </Box>
    )
  }
}

export default withStyles({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: '100',
  },
})(AppLoadingOverlay);