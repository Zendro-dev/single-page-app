import React     from 'react';

import Plot      from 'react-plotly.js';
import PropTypes from 'prop-types';

import CodeEditor from './CodeEditor';

import Button         from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';


const styled = withStyles(theme => ({
  root: {
    borderWidth: '1px',
    borderStyle: 'solid'
  },
}));


class PlotEditor extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor () {
    super();
    this.state = {
      code: `
      function createPlot() {

        const trace1 = {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [20, 14, 23],
          name: 'SF Zoo',
          type: 'bar'
        };

        const trace2 = {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [12, 18, 29],
          name: 'LA Zoo',
          type: 'bar'
        };

        const data = [trace1, trace2];

        const layout = {barmode: 'group'};

        return {
          data,
          layout,
        };

      }

      createPlot()
      `,
      plot: null,
    }

    this.editorOptions = {
      mode: {
        name: 'javascript',
        json: true
      },
      tabSize: 2,
      lineNumbers: true,
    }
  }

  /**
   * Handle change events in the CodeEditor component.
   * @param {string} newCode new CodeEditor content
   */
  handleCodeChanged = (newCode) => {

    this.setState({ code: newCode });
  }

  handleRunCode = () => {

    const res = eval(this.state.code);
    console.log(res);
    this.setState({ plot: res });
  }

  render () {
    return (
      <div>
        <div>
          <CodeEditor
            className={ this.props.classes.root }
            options={ this.editorOptions }
            value={ this.state.code }
            onChange={ this.handleCodeChanged }
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={ this.handleRunCode }
          >
            Run Code
          </Button>
        </div>
        {
          this.state.plot &&
          <Plot
            { ...this.state.plot }
            config={{
              responsive: true,
            }}
          />
        }
      </div>
    )
  }
}

export default styled(PlotEditor);
