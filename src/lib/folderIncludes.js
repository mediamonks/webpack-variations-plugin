const path = require('path');

module.exports = (source, destination) =>
  destination.includes(source) &&
  destination.split(path.dirname(source) + path.sep)[1].split(path.sep)[0] ===
    path.basename(source);
