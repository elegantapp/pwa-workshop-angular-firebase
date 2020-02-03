const superstatic = require('superstatic');
const connect = require('connect');
const https = require('https');
const fs = require('fs');

const keyFile = process.argv[2];
const certFile = process.argv[3];

const spec = {
  config: {
    public: './www',
    rewrites: [{
      source: '**',
      destination: '/index.html'
    }]
  },
  cwd: process.cwd()
};

const httpsOptions = {
  key: fs.readFileSync(keyFile),
  cert: fs.readFileSync(certFile)
};

const app = connect().use(superstatic(spec));

https.createServer(httpsOptions, app).listen(443, (err) => {
  if (err) { console.log(err); }
  console.log('Superstatic serves at https://10.0.2.2 on emulator and at https://localhost on desktop ...');
});

// Redirect to https
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);
