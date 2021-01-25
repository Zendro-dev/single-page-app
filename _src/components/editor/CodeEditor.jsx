import React      from 'react';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/keymap/vim';
import 'codemirror/mode/javascript/javascript';



export default class CodeEditor extends React.Component {

  constructor () {
    super();

    /** @type {CodeMirror.EditorFromTextArea?} */
    this.codeMirrorRef = null;
    this.textAreaRef = null;
  }

  /* LIFECYCLE METHODS */

  componentDidMount () {

    this.codeMirrorRef = CodeMirror.fromTextArea(this.textAreaRef, this.props.options);

    this.codeMirrorRef.on('change', this.onEditorValueChanged);

    this.codeMirrorRef.setValue(this.props.value || '');
    this.codeMirrorRef.setSize("100%", "100%");
  }

  componentDidUpdate (prevProps) {
    if (prevProps.value !== this.props.value){
      const cursor = this.codeMirrorRef.getCursor();
      this.codeMirrorRef.setValue(this.props.value);
      this.codeMirrorRef.setCursor(cursor);
    }
  }

  /* EVENT HANDLERS */

  /**
   * Handler for the onChange event of the code editor.
   * @param {CodeMirror.Editor}          doc document interface exposing the editor API
   * @param {CodeMirror.EditorChange} change diff interface containing editor changes
   */
  onEditorValueChanged = (doc, change) => {

    if (this.props.onChange && change.origin !== 'setValue') {
      this.props.onChange(doc.getValue(), change);
    }
  }

  /* RENDER */

  render () {
    return (
      <div className={ this.props.className } >
        <textarea
          ref={ref => this.textAreaRef = ref}
          name={this.props.name || this.props.path}
          autoComplete="off"
        />
      </div>
    )
  }
}
