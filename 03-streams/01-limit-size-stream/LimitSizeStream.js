const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor({limit, encoding}) {
    super({limit, encoding});
    this._limit = limit;
    this._currentLength = 0;
  }

  _transform(chunk, encoding, callback) {
    if (this._limit < chunk.length + this._currentLength) {
      callback(new LimitExceededError());
    } else {
      this._currentLength += chunk.length;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
