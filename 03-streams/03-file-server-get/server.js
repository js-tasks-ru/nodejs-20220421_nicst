const http = require('http');
const path = require('path');

const server = new http.Server();
const fs = require('fs');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  switch (req.method) {
    case 'GET':
      if (! /^[^\/]*$/.test(pathname)) {
        console.log(pathname);
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }
      fs.readFile(filepath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
          } else {
            res.statusCode = 500;
            res.end(`Internal server error:\n${err.toString()}`);
          }
        } else {
          res.end(data);
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
