const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (! /^[^\/]*$/.test(pathname)) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }
      fs.open(filepath, 'wx', (err, fd) => {
        let written = false;
        if (err) {
          if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File already exists');
            return;
          }
          res.statusCode = 500;
          res.end('Internal server error');
          return;
        }
        const file = fs.createWriteStream(filepath, {
          fd,
        });

        const limitSizeStream = new LimitSizeStream({
          limit: Math.pow(2, 20),
        });
        limitSizeStream.pipe(file);

        req.on('data', (chunk) => {
          limitSizeStream.write(chunk);
        });

        req.on('end', () => {
          limitSizeStream.end();
          written = true;
        });

        req.on('close', () => {
          if (!written) {
            limitSizeStream.end();
            file.close(() => {
              fs.unlink(filepath, () => {
                res.statusCode = 500;
                res.end('Internal server error');
              });
            });
          }
        });

        limitSizeStream.on('end', () => {
          file.close(() => {
            res.statusCode = 201;
            res.end('File created');
          });
        });

        limitSizeStream.on('error', (err) => {
          if (err instanceof LimitExceededError) {
            file.close(() => {
              fs.unlink(filepath, () => {
                res.statusCode = 413;
                res.end('Limit exceeded');
              });
            });
          }
        });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
