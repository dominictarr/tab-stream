//we need a server even though the example is static,
//because just running the app as a file does not share a domain,
//so the tabs do not get shared access to localStorage.
var http = require('http')
var Ecstatic = require('ecstatic')
http.createServer(
  Ecstatic(__dirname+'/static')
).listen(3000)

