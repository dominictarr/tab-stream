//stream between tabs, via localStorage

var EventEmitter = require('events').EventEmitter
var Duplex       = require('duplex')
var Tabs         = require('count-tabs')

var streams = {}
//only localStorage will work.
//session storage is scoped to the current window
//(but persists between pages viewed in that same window on the same domain...)
var storage = localStorage

function error (code, message) {
  var err = new Error(message)
  err.code = code
  return err
}

var tabs = Tabs(function () {
      //when a tab is closed, check if there are any streams to it,
      //and make them error...
      //the client needs to know what tab the server is on,
      //and the server needs to know what tab the client is on.
      //attach that to the first message?
      //either the first message, or another key?
      for(var port in streams) {
        var stream = streams[port]
        //check if other end is still up!
        if(stream.host && !tabs.tabs[stream.host]) {
          //this doesn't actually emit 
          stream.destroy()
        }
      }
    })

CTABS = tabs

console.log(tabs.tabs)

function createStream(id, server) {
  console.log('CREATE STREAM', id)
  if(id === 'TABSTREAM_hi_')
    throw new Error('wtf')
  var d = streams[id] = Duplex()

//  d.host = host
  d.port = id
  d.count = 0

  d.on('_data', function (data) {
    storage[id] = ((server ? -1 : 1) * (d.count ++)) + ':' + data
  }).on('_end', function () {
    storage[id] = null
  }).on('close', function () {
    delete storage[id]
    delete streams[id]
  })
  //write your tab id, as the first message.
  
  if(storage[id]) {
    d.host = storage[id].substring(2) //"0:...."
  }
  d.write(tabs.id)
  if(!server) {
    var timeout = setTimeout(function () {
      d.emit('error', new Error('ECONNREFUSED', 'cannot connect to '+id))
    }, 200)
    d.once('connect', function () {
      clearTimeout(timeout)
    })
  }
  return d
}

window.addEventListener('storage', function (se) {
  if(se.storageArea !== storage) return
  var stream = streams[se.key]
  if(stream) {
    var val = se.newValue
    var i = val.indexOf(':')
    var c = Number(val.substring(0, i))
    var data = val.substring(i + 1)
    if(!stream.host && data) {
      stream.host = data
      return stream.emit('connect')
    }
    data === null ? stream._end() : stream._data(data)
  }
})

exports.createServer = function (onConnection) {

  var server = new EventEmitter()
  if(onConnection)
    server.on('connection', onConnection)

  function onStorage (se) {
    if(se.storageArea !== storage) return
    if(se.key === server.key) {
      //port was stolen.
      window.removeEventListener('storage', onStorage, false)
      return server.emit('error', error('EADDRINUSE', 'port stolen'))
    }
    if(0 !== se.key.indexOf(server.key)) return
    if(!streams[se.key]) {
      server.emit('connection', createStream(se.key, true))
    }
  }

  server.listen = function (id, onListening) {
    if(onListening)
      server.once('listening', onListening)
    //register a listener.

    process.nextTick(function () {
      var key = 'TABSTREAM_'+id+'_'
      server.key = key
      console.log(storage[key], tabs.id)
      //check if the 'port' is available
      var other = storage[key]
      if(other !== tabs.id && tabs.tabs[other]) {
        return server.emit('error', error('EADDRINUSE', 'Error, port unavailable'))
      }
      //what happens if another client sets 
      window.addEventListener('storage', onStorage, false)
      storage[key] = tabs.id
      server.emit('listening')
    })
    return server
  }
  return server
}

exports.connect = function (id) {
  if(!id) throw new Error('must provide port')
  var key = 'TABSTREAM_'+id+'_'

  if(!storage[key] || !tabs.tabs[storage[key]]) {
    var d = Duplex()
    process.nextTick(function () {
      d.emit('error', error('ECONNREFUSED', 'could not connect to port:'+id))
      d.destroy()
    })
    return d
  }
  return createStream(key + Date.now()+'_'+tabs.id)
}

