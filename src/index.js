module.exports = class {
  constructor() {}

  /**
   * Function gets called by webpack when the plugin is initialized.
   * @param {object} compiler The webpack compiler.
   */
  apply(compiler) {
    compiler.hooks.afterCompile.tapAsync('webpack-variations', (compilation, callback) => {
      callback();
    });
  }
};
