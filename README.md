# webpack-variations

This plugin makes it possible to output multiple variations of a single project. In each output script, there is a unique object available as a global constant.
It is similar to the webpack DefinePlugin but also copies the project files to the output directory.

## Install
```javascript
npm i -D @mediamonks/webpack-variations
```
or
```javascript
yarn add -D @mediamonks/webpack-variations
```
## Usage

To use this plugin, you first have to require it. Secondly, you have to add an instance of it to the plugin array in the webpack.config.js. You have to pass the options object to it.


### Options

You have to pass the following options to the plugin.

#### `variations: <Object>` (required)
The variations of the build output. Each item in the object defines one output variation. The key of each variation defines the name (and folder name) of the variation. The value of the variation will be included in the build as a global variable called CONFIG.

#### `rename: <Array>` (optional)
An array containing rename instructions as objects. Each instruction object has a test string and a rename string property. The test string is a glob pattern and should match the base name of all files which should be renamed. Two tests should not match the same files. If two tests match the same file, only the first one is used. The rename string is the new base name of the file. This filename may include the following placeholders: 
- `%variationName%` - The name of the variation, as specified in the variations object.
- `%name%` - The original name of the file without a path and without the file extension (see the example [here](https://nodejs.org/api/path.html#path_path_parse_path)).
- `%base%` - The original filename of the file including the extension (see the example [here](https://nodejs.org/api/path.html#path_path_parse_path)).
- `%extension%` - The original file extension of the file.
The placeholders are replaced with the corresponding values. Invalid placeholders are left in the filename.
> Current limitation: Renaming only works in the root directory. Renaming the webpack output is also not possible.

#### `ignore: <Array>` (optional)
An array containing [GLOB]("https://en.wikipedia.org/wiki/Glob_(programming)") strings which are ignored during the copy process.

#### `constantName: <String>` (optional) 
The name of the global constant in which the object will be saved. This defaults to ‘CONFIG’.


### Example

**webpack.config.js**
```javascript
const WebpackVariations = require('@mediamonks/webpack-variations');

module.exports = {
  // ...
  plugins: [
    new WebpackVariations({
      variations: {
        tokio: {
          country: 'Japan',
        },
        berlin: {
          country: 'Germany',
        },
        rio: {
          country: 'Brazil',
        },
      },
      rename: [
        {
          test: 'town-info.html',
          rename: '%variationName%-info.html',
        },
      ],
      ignore: ['glob/**/index.js', 'node_modules', '.git'],
      constantName: 'CONFIG',
    }),
  ],
};
```

In this example, there will be three folders in the build directory called tokio, berlin and rio. In each folder, there will be the project files from the root project directory without the node_modules and the .git folder. Also, all index.js files in all subfolders of ‘glob’ won’t be copied into the variation build folders. Each variation build folder will also include a webpack output file (e.g. main.bundle.js). 
Each of the webpack output files will include the unique object specified in the config.
Apart from this, the town-info.html file in the project folder will be renamed according to the varation name (e.g. in the berlin folder to 'berlin-info.html').

The final directory structure will look something like this:

```
├── build
│   ├── tokio
│   │   ├── build
│   │   │   └── main.bundle.js
│   │   ├── tokio-info.html
│   │   └── someOtherFile.txt
│   ├── berlin
│   │   ├── build
│   │   │   └── main.bundle.js
│   │   ├── berlin-info.html
│   │   └── someOtherFile.txt
│   ├── rio
│   │   ├── build
│   │   │   └── main.bundle.js
│   │   ├── rio-info.html
│   │   └── someOtherFile.txt
├── node_modules
├── .git
├── src
│   ├── script.js
│   └── someModule.js
├── town-info.html
└── someOtherFile.txt
```

The build/tokio/build/main.bundle.js file will look something like this:

```javascript
const CONFIG = {"country":"Japan"};
// ...webpack output
```
