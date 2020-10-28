import React     from 'react';
import PropTypes from 'prop-types';
import Plot      from 'react-plotly.js';

import {
  withStyles
} from '@material-ui/core/styles';

import {
  Button,
  Link
} from '@material-ui/core';

import CodeEditor     from './CodeEditor';
import { createPlot } from './PlotEditorInitialCode';

const styled = withStyles(theme => ({
  root: {
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  buttonsContainer: {
    display: 'flex',
  }
}));


class PlotEditor extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor () {
    super();
    this.state = {
      code: createPlot.toString(),
      exportUrl: null,
      plot: null,
    }

    /** @type {CodeMirror.EditorConfiguration} */
    this.editorOptions = {
      mode: {
        name: 'javascript',
        globalVars: true,
      },
      tabSize: 2,
      lineNumbers: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete'
      },
      hintOptions: {
        hint: this.onEditorAutocomplete
      }
    }
  }


  /* ACTION HANDLERS */

  exportCodeButtonClick = (event) => {

    const blob = new Blob([ this.state.code ], {
      type: 'application/text'
    });

    this.setState({ exportUrl: URL.createObjectURL(blob) });

  }

  /**
   * Execute code within the editor.
   */
  handleRunCode = () => {

    try {

      this.setState({ plot: eval('(' + this.state.code + ')()') });
    }
    catch (error) {
      console.error(error.message);
    }
  }


  /* EVENT HANDLERS */

  /**
   * Provide autocompletion for imported request modules.
   * @param {CodeMirror.EditorFromTextArea}      editor  editor instance
   * @param {CodeMirror.ShowHintOptions}    hintOptions editor hint options
   */
  onEditorAutocomplete = (editor, hintOptions) => {

    console.log(editor);
  }

  /**
   * Handle change events in the CodeEditor component.
   * @param {string} newCode new CodeEditor content
   */
  onCodeChanged = (newCode) => {

    this.setState({ code: newCode });
  }

  /* RENDER */

  render () {
    return (
      <div>
        <div>
          <CodeEditor
            className={ this.props.classes.root }
            options={ this.editorOptions }
            value={ this.state.code }
            onChange={ this.onCodeChanged }
          />
          <div
            className={ this.props.classes.buttonsContainer }
          >

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={ this.handleRunCode }
            >
              Run Code
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="small"
            >
              Import Code
            </Button>

            <Button
              component={ Link }
              target="_blank"
              rel="noreferrer"
              href={ this.state.exportUrl }
              onClick= { this.exportCodeButtonClick }
              download="code.js"
              variant="contained"
              color="primary"
              size="small"
            >
              Export Code
            </Button>

          </div>
        </div>
        {
          this.state.plot &&
          <Plot
            { ...this.state.plot }
          />
        }
      </div>
    )
  }
}

export default styled(PlotEditor);
