const ConcatSource = require('webpack-sources/lib/ConcatSource');
const getScript = require('./getScript');
const makePrepend = require('./makePrepend');
const copy = require('./copy');
const Renamer = require('./Renamer');
const path = require('path');

const PROJECT_PATH = path.resolve('./');

console.log(PROJECT_PATH);

/**
 * Handles the plugin logic in development mode.
 */
module.exports = async ({ compiler, compilation, variations, rename, ignore, constantName }) => {
  console.log(compiler.options.mode);
  let script = await getScript(compilation);

  let defaultVariation = variations._defaultVariation;

  // Checking the default variation property.
  if (typeof defaultVariation !== 'string') {
    console.warn(
      'No default variation provided! The webpack variations plugin will use the first variation.',
    );
    defaultVariation = Object.keys(variations)[0];
  }

  if (typeof variations[defaultVariation] !== 'object') {
    console.warn(
      'Default variation not found! The webpack variations plugin will use the first variation.',
    );
    defaultVariation = Object.keys(variations)[0];
  }

  // Getting the object to be prepended
  let content = variations[defaultVariation];

  // Identifiing wether the scripts source is a ConcatSource or a normal RawSource.
  let scriptSource = compilation.assets[script.sourceName];
  if (typeof scriptSource === 'object' && scriptSource.constructor.name === 'ConcatSource') {
    // Making a new concat source with the object contents of the previous ConcatSource.
    compilation.assets[script.sourceName] = new ConcatSource(
      makePrepend(constantName, content),
      scriptSource.source(),
    );
  } else {
    // Concating the object to the webpack source and saving in new asset.
    compilation.assets[script.sourceName] = new ConcatSource(
      makePrepend(constantName, content),
      '\n',
      scriptSource,
    );
  }
};
