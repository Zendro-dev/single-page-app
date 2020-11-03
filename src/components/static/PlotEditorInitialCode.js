export async function createPlot(zendroApi) {

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

  console.log(zendroApi);

  const schema = '';
  const apiKey = ''

  const res = await fetch(`https://api.mockaroo.com/api/${schema}?count=10&key=${apiKey}`)
  if (!res.ok)
    return;

  const json = await res.json();

  const x = json.map(x => x.name.split(' ').shift());
  const y1 = json.map(y => y.count);
  const y2 = json.map(y => Math.floor( Math.random() * (y.count*1.5)) );

  const trace1 = { x, y: y1, name: 'Sierra Nevada', type: 'bar' };
  const trace2 = { x, y: y2, name: 'Jiuzhai Valley', type: 'bar' };

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
