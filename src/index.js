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
   * @param {Array} options[].ignore Array of glob patters for ignoring files. All files which match one of these pattern won't be copied.
   * @param {String} [options[].constantName = CONFIG] The name of the global constant where the object is saved.
   */
  constructor({variations, ignore, constantName = 'CONFIG'}) {
    this.variations = variations;
    this.ignore = ignore;
    this.constantName = constantName;
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
        ignore: this.ignore,
        constantName: this.constantName,
      }).then(() => {
        callback();
      }).catch(error => {
        console.error(error)
      });
    });
  }
};
