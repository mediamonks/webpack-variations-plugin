const handler = require('./lib/handler');

module.exports = class {
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
