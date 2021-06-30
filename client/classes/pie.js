export class Pie {
  constructor(canvas) {
    this.canvas = canvas;
    this.init();
  }

  init() {
    const size = getComputedStyle(this.canvas).getPropertyValue('height').slice(0, -2);
    this.canvas.setAttribute('height', size);
    this.canvas.setAttribute('width', size);
  }

  draw(data) {
    console.log(data);
    const fillColors = ['cornflowerblue', 'salmon', 'peachpuff', 'mediumaquamarine'];

    // get data cumulative total of all data point values
    const totData = data.reduce((cumTot, dataPoint) => cumTot + dataPoint.value, 0);

    // convert data to a portion of TAU
    for (const dataPoint of data) {
      dataPoint.slice = dataPoint.value / totData * (2 * Math.PI);
      console.log(dataPoint);
    }

    // declare pi chart position and size
    const radius = this.canvas.height / 2.5;
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;

    // draw on canvas
    const c = this.canvas.getContext('2d');
    let lastDataSpot = Math.PI * 1.5;
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].slice === 0) continue;

      // get next colour
      const currentColor = fillColors[i % fillColors.length];
      c.fillStyle = currentColor;
      c.strokeStyle = currentColor;

      // draw next slice
      c.beginPath();
      c.arc(x, y, radius, lastDataSpot, lastDataSpot + data[i].slice);
      c.lineTo(x, y);
      c.closePath();
      c.fill();
      c.stroke();

      // update next slice start
      lastDataSpot += data[i].slice;
    }
    // make circle in middle of pi chart to make doughnut chart (option stylistic choice)
    c.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--lighter-bg-color');
    c.beginPath();
    c.arc(x, y, radius / 2, 0, 2 * Math.PI);
    c.fill();
  }
}
