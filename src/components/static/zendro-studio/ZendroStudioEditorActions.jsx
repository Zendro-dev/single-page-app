import React from 'react';

import {
  Button,
  CircularProgress,
  Link,
} from '@material-ui/core';

import {
  CloudDownload as IconImportCode,
  CloudUpload   as IconExportCode,
  Code          as IconRunCode,
} from '@material-ui/icons';

import { ZendroStudioEditorContext } from './ZendroStudioEditor';


export default class ZendroStudioEditorActions extends React.Component {

  constructor () {
    super();
    this.state = {
      exportUrl: null,
    }
  }

  /**
   * Download editor code as a javascript file.
   */
  onExportCodeButtonClick = (code) => {

    const blob = new Blob([ code ], {
      type: 'application/text'
    });

    this.setState({ exportUrl: URL.createObjectURL(blob) });

  }

  /**
   * Import editor code from a javascript file.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  onImportCodeButtonClick = (event) => {

    // Box and reset file input to allow consecutive uploads of the same file
    const file = event.target.files[0];
    event.target.value = null;

    // Use the FileReader API to parse the input file
    const reader = new FileReader();

    reader.onload = () => {
      const code = reader.result;
      this.props.onImportCode(code)
    };

    reader.onerror = error => {
      console.err(error)
    };

    reader.readAsText(file, 'utf-8');

  }

  /**
   * Execute code within the editor.
   */
  onRunCodeButtonClick = async (code) => {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const functionBody = code.slice(code.indexOf('{')+1, code.lastIndexOf('}'));
    const asyncCreatePlot = new AsyncFunction('zendroApi', functionBody);
    this.props.onRunCode(asyncCreatePlot)
  }

  render () {
    return (
      <ZendroStudioEditorContext.Consumer>
        {
          ({ code, loading }) => (
            <>
              <Button
                component="label"
                variant="contained"
                size="small"
                startIcon={ <IconExportCode/> }
              >
                Import
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
                onClick= { () => this.onExportCodeButtonClick(code) }
                download="code.js"
                variant="contained"
                size="small"
                startIcon={ <IconImportCode/> }
              >
              Export
              </Button>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={ () => this.onRunCodeButtonClick(code) }
                startIcon={
                  loading
                    ?
                    <CircularProgress color="white" size={ 16 } />
                    :
                    <IconRunCode/>
                }
              >
              Run
              </Button>
            </>
          )
        }
      </ZendroStudioEditorContext.Consumer>
    )
  }
}