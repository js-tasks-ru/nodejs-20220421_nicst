const http = require('http');
const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (! /^[^\/]*$/.test(pathname)) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }
      exec('lsof ' + filepath, function(err, stdout) {
        if (stdout.length === 0) {
          fs.rm(filepath, (err) => {
            if (err) {
              if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end('File not found');
              } else {
                res.statusCode = 500;
                res.end('Internal server error');
              }
            } else {
              res.statusCode = 200;
              res.end('Deleted');
            }
          });
        } else {
          res.statusCode = 500;
          res.end('Internal server error. File is used by another process');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
