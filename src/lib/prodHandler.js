const ConcatSource = require('webpack-sources/lib/ConcatSource');
const getScript = require('./getScript');
const makePrepend = require('./makePrepend');
const copy = require('./copy');
const Renamer = require('./Renamer');
const path = require('path');

const PROJECT_PATH = path.resolve('./');

console.log(PROJECT_PATH);

/**
 * Handles the plugin logic in production mode.
 */
module.exports = async ({ compiler, compilation, variations, rename, ignore, constantName }) => {
  console.log('Running in production mode!');

  console.log(compiler.options.mode);
  let script = await getScript(compilation);
  let scriptSource = script.sourceContents._value;

  let buildPath = compiler.options.output.path;
  let relativeBuildPath = path.relative(PROJECT_PATH, buildPath);

  for (const variationName of Object.keys(variations)) {
    if (variationName === '_defaultVariation') {
      break;
    }

    // Getting the object to be prepended
    let content = variations[variationName];

    // Concating the object to the webpack source and saving in new asset.
    compilation.assets[
      path.join(variationName, relativeBuildPath, 'main.bundle.js')
    ] = new ConcatSource(makePrepend(constantName, content), '\n', scriptSource);

    let renamer = new Renamer({
      instructions: rename,
      data: {
        variationName,
      },
    });
    // Copying all other project files into current directory
    let copyResult = await copy({
      source: PROJECT_PATH,
      destination: path.join(PROJECT_PATH, relativeBuildPath, variationName),
      ignore,
      renamer,
    });

    console.log(`Copied ${copyResult.numberOfFiles} files in ${variationName}.`);
  }
};
