function getData(n, x, y) {
  var data = [];
  for (var i=0; i<n; i++) {
    data.push([Math.random() * x, Math.random() * y]);
  }
  return data;
}
