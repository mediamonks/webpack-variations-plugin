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
   * @param {object} options The optins of the plugin.
   * @param {object} options.variations Object with an object for each generation in it.
   * @param {Array} options.ignore Array of glob patters for ignoring files. All files which match one of these pattern won't be copied.
   */
  constructor(options) {
    this.variations = options.variations;
    this.ignore = options.ignore;
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
      }).then(() => {
        callback();
      }).catch(error => {
        console.error(error)
      });
    });
  }
};
