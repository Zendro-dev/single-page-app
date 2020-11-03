import React     from 'react';
import PropTypes from 'prop-types';
import Plot      from 'react-plotly.js';
import clsx      from 'classnames';

import {
  withStyles
} from '@material-ui/core/styles';

import {
  Accordion as MuiAccordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  Typography,
} from '@material-ui/core';

import {
  CloudDownload as IconImportCode,
  CloudUpload   as IconExportCode,
  Code          as IconRunCode,
  ExpandMore    as IconExpandEditor,

} from '@material-ui/icons';

import CodeEditor     from './CodeEditor';
import { createPlot } from './PlotEditorInitialCode';

import zendroApi from '../../requests/requests.index';

const Accordion = withStyles({
  root: {
    boxShadow: 'none',
  },
})(MuiAccordion);


const styled = withStyles(theme => ({
  editorArea: {
    margin: theme.spacing(0, 1, 2, 1),
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: '100',
  },
  editor: {
    border: '1px solid rgba(0, 0, 0, .125)',
    width: '100%',
  },
  plot: {
    margin: theme.spacing(2, 0),
    width: '100%',
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(0, 0, 0, 1),
  },
  //
  actions: {
    margin: theme.spacing(0, 1),
  }
}));


class PlotEditor extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props);

    const createPlotCode = props.preloadCode
      ? props.preloadCode
      : createPlot.toString();

    this.state = {
      initialCode: createPlotCode,
      code: createPlotCode,
      exportUrl: null,
      preloaded: !!props.preloadCode,
      loading: false,
      plot: null,
    }

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

  componentDidMount () {
    if (this.state.preloaded) {
      this.onRunCodeButtonClick();
    }
  }


  /* ACTION HANDLERS */

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
      const newCode = reader.result;
      this.setState({
        code: newCode,
        initialCode: newCode,
      });
    };

    reader.onerror = error => {
      console.err(error)
    };

    reader.readAsText(file, 'utf-8');


  }

  /**
   * Download editor code as a javascript file.
   */
  onExportCodeButtonClick = () => {

    const blob = new Blob([ this.state.code ], {
      type: 'application/text'
    });

    this.setState({ exportUrl: URL.createObjectURL(blob) });

  }

  /**
   * Execute code within the editor.
   */
  onRunCodeButtonClick = async () => {

    const code = this.state.code;
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const functionBody = code.slice(code.indexOf('{')+1, code.lastIndexOf('}'));
    const createPlot = new AsyncFunction('zendroApi', functionBody);

    this.setState({ loading: true });

    try {
      this.setState({ plot: await createPlot(zendroApi) });
    }
    catch (error) {
      console.error(error.message);
    }

    this.setState({ loading: false });

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
        <div className={this.props.classes.editorArea}>

          {
            this.state.loading &&
            <Box
              className={ this.props.classes.overlay }
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
                  Executing Code
                </Box>
              </Typography>
            </Box>
          }

          <Accordion
            style={{ opacity: this.state.loading ? '50%' : '100%' }}
            defaultExpanded={ !this.state.preloaded }
          >

            {/* COLLAPSIBLE HEADER */}
            <AccordionSummary expandIcon={ <IconExpandEditor/> } >
              <Typography> Code Editor </Typography>
              <Typography className={ this.props.classes.secondaryHeading } >
                Use JavaScript to dynamically create a plot
              </Typography>
            </AccordionSummary>

            {/* EDITOR VIEW */}
            <AccordionDetails>
              <CodeEditor
                className={ this.props.classes.editor }
                options={ this.editorOptions }
                value={ this.state.initialCode }
                onChange={ this.onCodeChanged }
              />
            </AccordionDetails>

            {/* EDITOR ACTIONS */}
            <AccordionActions className={ this.props.classes.actions }>

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
                onClick= { this.onExportCodeButtonClick }
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
                onClick={ this.onRunCodeButtonClick }
                startIcon={ <IconRunCode/> }
              >
                  Run
              </Button>

            </AccordionActions>

          </Accordion>
        </div>

        <Divider />

        {/* PLOT */}
        {
          this.state.plot &&
          <Plot
            className={ this.props.classes.plot }
            { ...this.state.plot }
          />
        }

      </div>
    )
  }
}

export default styled(PlotEditor);
