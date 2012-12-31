# tab-stream

Create [net](https://nodejs.org/api/net.html) style servers, connections between browser-tabs.

Using an ... ugly hack, messsages are sent between browser tabs/windows from the same domain.

Just pretend it's a net server unix socket...

> Note, this can currently only connect to servers located on _other_ tabs. 
> this is incorrect, compared to the net module, because it should be possible
> to connect to a server created within the same process, but this feature is not important
> currently.

## Example

``` js

var tab = require('tab-stream')

tab.createServer(function (stream) {
  //SERVER
}).listen('socket')

//CLIENT
tab.connect('socket')
```

Instead of a numerical port, passing a string will work.
The idea is to make this as close to [net](https://nodejs.org/api/net.html) as possible.

See also, [autonode](https://github.com/dominictarr/autonode)

## License

MIT
