var tabs = TABS = require('../')
var Autonode = require('autonode').inject(tabs)
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

var autonode = 
  Autonode(function (stream) {
    console.log('autonode - connect')
    stream.pipe(repred.createStream()).pipe(stream)
  }).listen('hi')

var input, label

document.body.appendChild(
  h('div', 
    input = h('input', {input: function () {
        repred.update(input.value)
      }
    }),
    label = h('label', '(unconnected)')
  )
)

repred.on('update', function (up) {
  if(input.value != up.val)
    input.value = up.val
})

autonode
  .on('listening', function () {
    label.innerText = '(server)'
  })
  .on('connecting', function () {
    label.innerText = '(client)'
  })

