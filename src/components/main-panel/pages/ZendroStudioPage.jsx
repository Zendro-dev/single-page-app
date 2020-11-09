import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import ZendroStudio from '../../static/zendro-studio/ZendroStudio';


class ZendroStudioPage extends React.Component {

  render () {
    return (
      <div className={ this.props.classes.root }>
        <ZendroStudio />
      </div>
    )
  }
}

export default withStyles(theme => ({
  root: {
    margin: theme.spacing(7, 0, 0, 0),
  }
}))(ZendroStudioPage);