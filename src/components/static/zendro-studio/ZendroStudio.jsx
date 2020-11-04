import React     from 'react';
import PropTypes from 'prop-types';
import Plot      from 'react-plotly.js';

import { Divider }    from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import AppLoadingOverlay         from '../base/AppLoadingOverlay';
import ZendroStudioEditor        from './ZendroStudioEditor';
import ZendroStudioEditorActions from './ZendroStudioEditorActions';

import { createPlot } from './ZendroStudioEditorCode';

import zendroApi from '../../../requests/requests.index';


class ZendroStudio extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props);

    const createPlotCode = props.preloadCode
      ? props.preloadCode
      : createPlot.toString();

    this.state = {
      code: createPlotCode,
      preloaded: !!props.preloadCode,
      loading: false,
      plot: null,
    }
  }

  /**
   * Provide autocompletion for imported request modules.
   * @param {CodeMirror.EditorFromTextArea}      editor  editor instance
   * @param {CodeMirror.ShowHintOptions}    hintOptions editor hint options
   */
  onEditorAutocomplete = (editor, hintOptions) => {

    console.log(editor);
  }

  /**
   * Update internal code state after after each editor change.
   * @param {string} code new CodeEditor content
   */
  onCodeChanged = (code) => this.setState({ code });

  /**
   * Update internal code state after importing new code from a javascript file.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  onImportCode = (code) => this.setState({ code });

  /**
   * Update the interal plot object state after executing the code.
   * @typedef {import('react-plotly.js').PlotParams} PlotParams
   * @param {() => PlotParams )} asyncCreatePlot async callback with client-side code
   */
  onRunCode = async (asyncCreatePlot) => {

    this.setState({ loading: true });

    try {
      this.setState({ plot: await asyncCreatePlot(zendroApi) });
    }
    catch (error) {
      console.error(error.message);
    }

    this.setState({ loading: false });

  }

  /* RENDER */

  render () {
    return (
      <div className={ this.props.classes.root }>
        <div className={ this.props.classes.editorArea }>

          {
            this.state.loading &&
            <AppLoadingOverlay
              text="executing code"
            />
          }

          <ZendroStudioEditor
            code={ this.state.code }
            loading={ this.state.loading }
            preloaded={ this.state.preloaded }
            onCodeChanged={ this.onCodeChanged }
          >
            <ZendroStudioEditorActions
              onImportCode={ this.onImportCode }
              onRunCode={ this.onRunCode }
            />
          </ZendroStudioEditor>

        </div>

        <Divider />

        {/* PLOT */}
        {
          this.state.plot &&
          <Plot
            config
            className={ this.props.classes.plot }
            { ...this.state.plot }
          />
        }

      </div>
    )
  }
}

export default withStyles(theme => ({
  root: {
    margin: theme.spacing(8, 0, 0, 0),
  },
  editorArea: {
    margin: theme.spacing(0, 0, 2, 0),
    position: 'relative',
  },
  plot: {
    backgroundColor: 'white',
    margin: theme.spacing(2, 0),
    width: '100%',
  },
}))(ZendroStudio);
