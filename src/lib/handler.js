const prodHandler = require('./prodHandler');
const devHandler = require('./devHandler');

/**
 * Handles the plugin logic.
 */
module.exports = async ({ compiler, compilation, variations, rename, ignore, constantName }) => {
  // Checking if in production or development mode and executing the corresponding version of the plugin.
  if (compiler.options.mode === 'production') {
    prodHandler({ compiler, compilation, variations, rename, ignore, constantName });
  } else {
    devHandler({ compiler, compilation, variations, rename, ignore, constantName });
  }
};
