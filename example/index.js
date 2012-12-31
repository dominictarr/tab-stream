var tabs = TABS = require('../')
var autonode = require('autonode').inject(tabs)
var Repred   = require('repred')
var h        = require('h')

function log(name, stream) {
  stream.on('data', function (data) {
    console.log(name, data)
  })
  return stream
}

//just update a singe value...
var repred = Repred(function (value) {
    return {ts: Date.now(), val: value}
  }, function (cur, up) {
    if(cur.ts < up.ts || !cur.ts) {
      cur.ts = up.ts
      cur.val = up.val
      return up
    }
  },
  {})

console.log(tabs)

autonode(function (stream) {
  console.log('autonode - connect')
  stream.pipe(repred.createStream()).pipe(stream)
}).listen('hi')

var input = h('input', {input: function () {
    repred.update(input.value)
  }
})

repred.on('update', function (up) {
//  if(input.value != up.val)
    input.value = up.val
})

document.body.appendChild(input)

