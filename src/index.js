const handler = require('./lib/handler');

/**
 * Create different variations of a build.
 * The plugin does two things:
 * 1. It prepends a unique JSON config variable to each webpack output.
 * 2. It copies all project files into the build directories
 */
module.exports = class {
  /**
   * Create a variations webpack plugin.
   * @param {Object[]} options The optins of the plugin.
   * @param {Object} options[].variations Object with an object for each generation in it.
   * @param {Object} options[].rename[] An array containing the rename instructions. Each instruction is an object containing a glob test string, and a new filename. The new filename may include placeholder for variables.
   * @param {Array} options[].ignore Array of glob patters for ignoring files. All files which match one of these pattern won't be copied.
   * @param {String} [options[].constantName = CONFIG] The name of the global constant where the object is saved.
   */
  constructor({ variations, rename, ignore, constantName = 'CONFIG' }) {
    this.variations = variations;
    this.rename = rename;
    this.ignore = ignore;
    this.constantName = constantName;

    // Checking inputs.
    if (typeof variations !== 'object') {
      throw new Error(
        'Webpack variations plugin: No variations object found! Please provide a variation object with at least one variation.',
      );
    }
    if (Object.keys(variations).length === 0 && variations.constructor === Object) {
      throw new Error(
        'Webpack variations plugin: Variations object is empty. Please provide at least one variation.',
      );
    }
  }

  /**
   * Function gets called by webpack when the plugin is initialized.
   * @param {object} compiler The webpack compiler.
   */
  apply(compiler) {
    compiler.hooks.emit.tapAsync('webpack-variations', (compilation, callback) => {
      handler({
        compiler,
        compilation,
        variations: this.variations,
        rename: this.rename,
        ignore: this.ignore,
        constantName: this.constantName,
      })
        .then(() => {
          callback();
        })
        .catch(error => {
          console.error(error);
        });
    });
  }
};
