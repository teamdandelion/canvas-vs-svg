function getData(n, x, y) {
  var data = [];
  for (var i=0; i<n; i++) {
    data.push([Math.random() * x, Math.random() * y]);
  }
  return data;
}
var pi2 = Math.PI * 2;

var meter;
function canvasStuff(w, h, data) {
  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  xScale.range([0, w]);
  yScale.range([h, 0]);
  xScale.domain([0, 1]);
  yScale.domain([0, 1]);

  var canvas = document.getElementById('canvas');
  d3.select("canvas").attr("width", w).attr("height", h);
  d3.select("#outercanvas").style("width", w + "px").style("height", h + "px");
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "rgb(100,0,100)"
  function render() {
    meter.tickStart();
    console.time("canvas");
    ctx.clearRect(0, 0, w, h);
    data.forEach(function(d) {
      ctx.beginPath();
      ctx.arc(xScale(d[0]), yScale(d[1]), 1, 0, pi2);
      ctx.fill();
    })
    meter.tick();
    console.timeEnd("canvas");
  }
  render();

  var z = new d3.behavior.zoom();
  var d = d3.select("#outercanvas");
  z(d);
  z.x(xScale);
  z.y(yScale);
  z.size([w, h]);
  z.on("zoom", render);
}

function svgStuff(w, h, data) {
  var svg = d3.select("svg").attr("width", w).attr("height", h);
  var g = svg.append("g");
  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  xScale.range([0, w]);
  yScale.range([h, 0]);
  xScale.domain([0, 1]);
  yScale.domain([0, 1]);

  g.selectAll("circle").data(data)
  .enter().append("circle")
  .attr("cx", function(d) {return xScale(d[0])})
  .attr("cy", function(d) {return yScale(d[1])})
  .attr("r", 1);
  // .attr("height", 1);
  var z = d3.behavior.zoom();
  z(svg);
  z.x(xScale);
  z.y(yScale);
  z.size([w, h]);
  z.on("zoom", translate);
  function translate() {
    meter.tickStart();
    console.time("svg");
    var translate = z.translate();
    var scale = z.scale();
    g.attr("transform", "translate(" + translate + ") scale(" + scale + ")");
    meter.tick();
    console.timeEnd("svg");
  }
}


function canvasLine(w, h, data) {
  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  xScale.range([0, w]);
  yScale.range([h, 0]);
  xScale.domain([0, 1]);
  yScale.domain([0, 1]);

  var canvas = document.getElementById('linecanvas');
  d3.select("#linecanvas").attr("width", w).attr("height", h);
  d3.select("#outerline").style("width", w + "px").style("height", h + "px");
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = "rgb(100,0,100)"
  function render() {
    meter.tickStart();
    console.time("canvas");
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    data.forEach(function(d) {
      ctx.lineTo(xScale(d[0]), yScale(d[1]));
    })
    ctx.stroke();
    meter.tick();
    console.timeEnd("canvas");
  }
  render();

  var z = new d3.behavior.zoom();
  var d = d3.select("#outerline");
  z(d);
  z.x(xScale);
  z.y(yScale);
  z.size([w, h]);
  z.on("zoom", render);
}

function svgLine(w, h, data) {
  var svg = d3.select("#line").attr("width", w).attr("height", h);
  var g = svg.append("g");
  var xScale = d3.scale.linear();
  var yScale = d3.scale.linear();
  xScale.range([0, w]);
  yScale.range([h, 0]);
  xScale.domain([0, 1]);
  yScale.domain([0, 1]);

  var line = d3.svg.line()
    .x(function(d) {return xScale(d[0])})
    .y(function(d) {return yScale(d[1])});
  g.append("path").datum(data).attr("d", line);
  var z = d3.behavior.zoom();
  z(svg);
  z.x(xScale);
  z.y(yScale);
  z.size([w, h]);
  z.on("zoom", translate);
  function translate() {
    meter.tickStart();
    console.time("svg");
    var translate = z.translate();
    var scale = z.scale();
    g.attr("transform", "translate(" + translate + ") scale(" + scale + ")");
    meter.tick();
    console.timeEnd("svg");
  }
}
window.onload = function() {
  meter = new FPSMeter();
var w = 400;
var h = 400;
var data = getData(10000, 1, 1);
data.sort(function(a, b) {return a[0] > b[0]});
canvasStuff(w, h, data);

svgStuff(w, h, data);
canvasLine(w, h, data);
svgLine(w, h, data);
}
