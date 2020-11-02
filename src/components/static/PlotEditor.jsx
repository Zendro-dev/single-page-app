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
      },
    }
  }


  /* ACTION HANDLERS */

  onImportCodeButtonClick = (event) => {

    // Box and reset file input to allow consecutive uploads of the same file
    const file = event.target.files[0];
    event.target.value = null;

    // Use the FileReader API to parse the input file
    const reader = new FileReader();

    reader.onload = () => {
      this.setState({ code: reader.result});
      // this.codeEditorRef.editorResetCode();
    };

    reader.onerror = error => {
      console.err(error)
    };

    reader.readAsText(file, 'utf-8');


  }

  onExportCodeButtonClick = (event) => {

    const blob = new Blob([ this.state.code ], {
      type: 'application/text'
    });

    this.setState({ exportUrl: URL.createObjectURL(blob) });

  }

  /**
   * Execute code within the editor.
   */
  onRunCodeButtonClick = () => {

    try {
      // eslint-disable-next-line
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
              onClick={ this.onRunCodeButtonClick }
            >
              Run Code
            </Button>

            <Button
              component="label"
              variant="contained"
              color="primary"
              size="small"
            >
              Import Code
              <input
                type="file"
                style={{ display: "none" }}
                accept="text/javascript"
                onChange={ this.onImportCodeButtonClick }
              />
            </Button>

            <Button
              component={ Link }
              target="_blank"
              rel="noreferrer"
              href={ this.state.exportUrl }
              onClick= { this.onExportCodeButtonClick }
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
