var path = require('path');
var express = require('express');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static(path.join(__dirname, 'dist/web')));

try {
  var middleware = require('./dist/node/node').default;
  app.use(middleware);
} catch (e) {
  console.error(e);
  console.error('ERROR: You need to build');
  process.exit(1);
}

app.listen(PORT, function(error) {
  if (error) return console.error(error);
  console.log('Webserver started at ' + PORT);
});
