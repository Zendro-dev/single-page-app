export async function createPlot() {

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

  const res = await fetch(`https://api.mockaroo.com/api/32e8da70?count=10&key=8a9a3ce0`)
  if (!res.ok)
    return;

  const json = await res.json();

  const x = json.map(x => x.name.split(' ').shift());
  const y1 = json.map(y => y.count);
  const y2 = json.map(y => Math.floor( Math.random() * (y.count*1.5)) );

  const trace1 = { x, y: y1, name: 'Sierra Nevada', type: 'bar' };
  const trace2 = { x, y: y2, name: 'Jiuzhai Valley', type: 'bar' };

  console.log(trace1, trace2);

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
