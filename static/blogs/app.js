var fs = require('fs');
var http = require('http');
var formidable = require('formidable');
var WebsocketServer = require('ws').Server
var wss = new WebsocketServer({port: 3004});
var server = http.createServer(function (req, res) {
  if (req.url == '/login') {
    switch (req.method) {
      case 'GET' :
        fs.createReadStream('./src/index.html').pipe(res);
        break;
      case 'POST':
        console.log('res', res);
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        })
        res.end('<html><body>欢迎来到nodeJS</body></html>')
        break;
      default:
        console.log('other request type');
    }
  } else if (req.url == '/upload') {
    var form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.uploadDir = __dirname + '/src'
    form.parse(req, function (err, fields, files) {
      if (err) {throw err}
      console.log(fields);
      console.log(files)
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end('upload finished')
    })
  } else {
    res.writeHead(302, {
      'Location': '/login'
    });
    res.end()
  }
})
server.listen(3000)

wss.on('connection', function (ws) {
  ws.on('message', function (msg) {
    console.log('received client:', msg)
    ws.send(msg)
  })
  ws.send('i am a message sent from a ws server')
})