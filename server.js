var express = require('express'),
path = require('path'),
    rootPath = path.normalize(__dirname);

var app = express()
app.use(express.static(rootPath));

app.get('/', function (req, res) {
  res.sendFile(path.join(rootPath + '/index.html'))
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
