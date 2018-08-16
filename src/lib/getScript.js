const path = require('path');

/**
 * Gets a script asset from the compilation.
 * @param {object} compilation Compilation object from an afterCompile event.
 * @return {object} Object containing the script.
 */
module.exports = compilation => {
  return new Promise((resolve, reject) => {
    // Getting the script from the assets
    Object.entries(compilation.assets).forEach(([sourceName, sourceContents]) => {
      let fileExtension = path.extname(sourceName);

      if (fileExtension === '.js') {
        console.log(fileExtension);

        resolve({
          sourceName,
          sourceContents,
        });
      }
    });
  });
};
