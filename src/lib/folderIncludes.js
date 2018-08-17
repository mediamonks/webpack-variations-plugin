const path = require('path');

/**
 * Check if the destination folder is inside the source folder.
 * @param {String} source Path of the source folder.
 * @param {String} destination Path of the destination folder.
 */
module.exports = (source, destination) =>
  destination.includes(source) &&
  destination.split(path.dirname(source) + path.sep)[1].split(path.sep)[0] ===
    path.basename(source);
