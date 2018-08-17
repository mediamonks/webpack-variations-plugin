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
      ignore: ['glob/**/index.js', 'node_modules', '.git'],
      constantName: 'CONFIG',
    }),
  ],
};
```

In this example, there will be three folders in the build directory called tokio, berlin and rio. In each folder, there will be the project files from the root project directory without the node_modules and the .git folder. Also, all index.js files in all subfolders of ‘glob’ won’t be copied into the variation build folders. Each variation build folder will also include a webpack output file (e.g. main.bundle.js). Each of the webpack output files will include the unique object specified in the config.

The final directory structure will look something like this:

```
├── build
│   ├── tokio
│   │   ├── build
│   │   │   └── main.bundle.js
│   │   └── someOtherFile.txt
│   ├── berlin
│   │   ├── build
│   │   │   └── main.bundle.js
│   │   └── someOtherFile.txt
│   ├── rio
│   │   ├── build
│   │   │   └── main.bundle.js
│   │   └── someOtherFile.txt
├── node_modules
├── .git
├── src
│   ├── script.js
│   └── someModule.js
└── someOtherFile.txt
```

The build/tokio/build/main.bundle.js file will look something like this:

```javascript
const CONFIG = {"country":"Japan"};
// ...webpack output
```
