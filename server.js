var express = require('express');
var app = express();
var path = require('path');

app.use('/ui',express.static(path.join(__dirname+'/ui')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(1337);
console.log('find app at port 1337');
