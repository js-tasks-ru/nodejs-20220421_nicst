const stream = require('stream');
const os = require('os');
// const Buffer = require("buffer");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding || 'utf-8';
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk, _encoding, callback) {
    const {encoding} = this;
    const chunkAsString = chunk.toString(encoding);
    if (chunkAsString.includes(os.EOL)) {
      const parts = chunkAsString.split(os.EOL);
      parts.forEach((part, index) => {
        switch (index) {
          case 0:
            this.push(Buffer.concat([this.buffer, Buffer.from(parts[0])]));
            this.buffer = Buffer.alloc(0);
            break;
          case parts.length - 1:
            this.buffer = Buffer.from(part, encoding);
            break;
          default:
            this.push(Buffer.from(part, encoding));
        }
      });
    } else {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    }
    callback();
  }

  _flush(callback) {
    callback(null, this.buffer);
    this.buffer = Buffer.alloc(0);
  }
}

module.exports = LineSplitStream;
