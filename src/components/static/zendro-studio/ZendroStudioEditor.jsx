import React, { createContext } from 'react';

import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';

import {
  ExpandMore as IconExpandEditor,
} from '@material-ui/icons';

import {
  withStyles
} from '@material-ui/core/styles';

import CodeEditor from '../code-editor/CodeEditor';


export const ZendroStudioEditorContext = createContext({
  code: '',
  loading: false,
})

class ZendroStudioEditor extends React.Component {

  constructor () {
    super();

    /** @type {CodeMirror.EditorConfiguration} */
    this.editorOptions = {
      lineNumbers: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete'
      },
      hintOptions: {
        hint: this.onEditorAutocomplete
      },
      keyMap: 'vim',
      mode: {
        name: 'javascript',
        globalVars: true,
      },
      tabSize: 2,
    }
  }

  render () {
    return (
      <ZendroStudioEditorContext.Provider value={{
        code: this.props.code,
        loading: this.props.loading,
      }}>
        <Accordion
          className={ this.props.classes.root }
          style={{ opacity: this.props.loading ? '50%' : '100%' }}
          defaultExpanded={ !this.props.preloaded }
        >
          {/* COLLAPSIBLE HEADER */}
          <AccordionSummary expandIcon={ <IconExpandEditor/> } >
            <Typography> Code Editor </Typography>
            <Typography className={ this.props.classes.h2 } >
                Use JavaScript to dynamically create a plot
            </Typography>
          </AccordionSummary>

          {/* EDITOR VIEW */}
          <AccordionDetails>
            <CodeEditor
              className={ this.props.classes.editor }
              options={ this.editorOptions }
              value={ this.props.code }
              onChange={ this.props.onCodeChanged }
            />
          </AccordionDetails>

          {/* EDITOR ACTIONS */}
          <AccordionActions className={ this.props.classes.actions }>
            { this.props.children }
          </AccordionActions>

        </Accordion>
      </ZendroStudioEditorContext.Provider>
    )
  }
}

export default withStyles(theme => ({
  // Accordion Root
  root: {
    boxShadow: 'none',
    border: '1px solid rgba(0, 0, 0, .125)',
  },
  // Accordion Heading
  h2: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(0, 0, 0, 1),
  },
  // Accordion Main
  editor: {
    border: '1px solid rgba(0, 0, 0, .125)',
    width: '100%',
  },
  // Accordion Actions
  actions: {
    margin: theme.spacing(0, 1),
  },
}))(ZendroStudioEditor);