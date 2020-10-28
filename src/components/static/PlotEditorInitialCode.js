export function createPlot() {

  /**
   * Welcome to the Zendro-Studio code editor interface.
   *
   * You can use this function to request data from the Zendro instance
   * via the exposed `request` modules API.
   *
   * To create a plot, return an object using the standard Plotly.js
   * API and it will be automatically rendered in the user interface.
   *
   * return {
   *  data,
   *  layout,
   *  config,
   * }
   *
   */

  const trace1 = {
    x: [ 'giraffes', 'orangutans', 'monkeys' ],
    y: [ 20, 14, 23 ],
    name: 'SF Zoo',
    type: 'bar',
  };

  const trace2 = {
    x: [ 'giraffes', 'orangutans', 'monkeys' ],
    y: [ 12, 18, 29 ],
    name: 'LA Zoo',
    type: 'bar',
  };

  const data = [
    trace1,
    trace2,
  ];

  const layout = {
    barmode: 'group',
  };

  const config = {
    responsive: true,
  }

  return {
    data,
    layout,
    config,
  };

}
