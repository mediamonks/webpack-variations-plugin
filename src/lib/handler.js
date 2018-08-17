const ConcatSource = require('webpack-sources/lib/ConcatSource');
const getScript = require('./getScript');
const makePrepend = require('./makePrepend');
const copy = require('./copy');
const path = require('path');

const PROJECT_PATH = path.resolve('./');

console.log(PROJECT_PATH);

/**
 * Handles the plugin logic.
 */
module.exports = async ({ compiler, compilation, variations, ignore }) => {
  let script = await getScript(compilation);
  let scriptSource = script.sourceContents._value;

  let buildPath = compiler.options.output.path;
  let relativeBuildPath =  path.relative(PROJECT_PATH, buildPath);

  // Looping over variations
  for (const variationName of Object.keys(variations)) {
    
    // Getting the object to be prepended
    let content = variations[variationName];

    // Concating the object to the webpack source and saving in new asset.
    compilation.assets[path.join(variationName, relativeBuildPath, 'main.bundle.js')] = new ConcatSource(
      makePrepend(content),
      '\n',
      scriptSource,
    );

    // Copying all other project files into current directory
    let copyResult = await copy(PROJECT_PATH, path.join(PROJECT_PATH, relativeBuildPath, variationName), ignore);

    console.log(`Copied ${copyResult.numberOfFiles} files in ${variationName}.`)
  }
};
