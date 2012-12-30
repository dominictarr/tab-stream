var tabs = TABS = require('../')
var autonode = require('autonode').inject(tabs)

function log(name, stream) {
  stream.on('data', function (data) {
    console.log(name, data)
  })
  return stream
}

console.log(tabs)

autonode(function (stream) {
  console.log('autonode - connect')
}).listen('hi')

/*
tabs.createServer(function (stream) {
  console.log('server - connection')
  log('server', stream)
  //THIS DOESN'T WORK, BECAUSE IS WRITING BACK THE SAME VALUE,
  //WHICH DOESN'T EMIT AN EVENT. guess the solution is to write 
  //a count prefix so that the value always changes.
  stream.pipe(stream)
}).on('error', function () {
  console.log('client - connection')
  CLIENT = log('client', tabs.connect('hello'))
  setInterval(function () {
    CLIENT.write(new Date())
  }, 1e3)
}).listen('hello')
*/
