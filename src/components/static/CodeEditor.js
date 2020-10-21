import React      from 'react';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';


export default class CodeEditor extends React.Component {

  constructor () {
    super();

    /** @type {CodeMirror.EditorFromTextArea?} */
    this.codeMirrorRef = null;
  }

  /* LIFECYCLE METHODS */

  componentDidMount () {

    this.codeMirrorRef = CodeMirror.fromTextArea(this.codeMirrorRef, this.props.options);

    this.codeMirrorRef.on('change', this.codeEditorValueChanged);

    this.codeMirrorRef.setValue(this.props.value || '')
    this.codeMirrorRef.setSize("100%", "100%");
  }

  /**
   * Handler for the onChange event of the code editor.
   * @param {CodeMirror.Editor}          doc document interface exposing the editor API
   * @param {CodeMirror.EditorChange} change diff interface containing editor changes
   */
  codeEditorValueChanged = (doc, change) => {

    if (this.props.onChange && change.origin !== 'setValue') {
			this.props.onChange(doc.getValue(), change);
		}
  }

  render () {
    return (
      <div className={ this.props.className } >
				<textarea
					ref={ref => this.codeMirrorRef = ref}
					name={this.props.name || this.props.path}
					defaultValue={ this.props.value }
          autoComplete="off"
        />
			</div>
    )
  }
}
