

var http = require('http')
var Ecstatic = require('ecstatic')
http.createServer(
  Ecstatic(__dirname+'/static')
).listen(3000)

