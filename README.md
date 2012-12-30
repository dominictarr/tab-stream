# tab-stream

Create [net](https://nodejs.org/api/net.html) style servers, connections between browser-tabs.

Using an ... ugly hack, messsages are sent between browser tabs/windows from the same domain.

Just pretend it's a net server unix socket...

## Example

``` js

var tab = require('tab-stream')

tab.createServer(function (stream) {
  //SERVER
}).listen('socket')

//CLIENT
tab.connect('socket')
```

Instead of a numerical port, just pass a string.
The idea is to make this as close to [net](https://nodejs.org/api/net.html) as possible.

Also, see [autonode](https://github.com/dominictarr/autonode)

## License

MIT
