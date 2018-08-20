const util = require('util');
const fs = require('fs');
fs.readdir = util.promisify(fs.readdir);
const { copy } = require('fs-extra');
const path = require('path');
const minimatch = require('minimatch');
const folderIncludes = require('./folderIncludes');
const Renamer = require('./Renamer');

const MINIMATCH_OPTIONS = {
  dot: true,
};

/**
 * Copy a source to a destination recursively while ignoring specific files.
 * @param {String} source Absolute path of the source directory.
 * @param {String} destination Absolute path of the destination directory.
 * @param {Array} ignore Array of glob strings specifiing which files to ignore when copiing.
 */
module.exports = async ({ source, destination, renamer, ignore }) => {
  if (!Array.isArray(ignore) || ignore.length < 1) {
    ignore = [];
  }

  // Creating a filter function for each supplied glob
  let filters = ignore.map(filterGlob => minimatch.filter(filterGlob, MINIMATCH_OPTIONS));

  let filterAll = file => filters.every(filter => !filter(file));

  let numberOfFiles = 0;
  let options = {
    filter: file => {
      // Getting the path relative to the source directory
      let fileRelative = path.relative(source, file);

      // Testing the file against every filter function. Returns true if all filters are false
      let filterResult = filterAll(fileRelative);

      if (filterResult) {
        numberOfFiles++;
      }
      return filterResult;
    },
  };

  let files = await fs.readdir(source);

  // Creating a promise for each copy process.
  let promises = files.map(file => {
    if (filterAll(file)) {
      let newFilename = file;

      // Getting rename instructions.
      let renameInstruction = renamer.getInstruction(file);

      // Cheking if the file should be renamed.
      if (renameInstruction !== null) {
        newFilename = renamer.rename(file, renameInstruction);
      }

      // Assembling absolute file paths.
      let sourceAbsolute = path.join(source, file);
      let destinationAbsolute = path.join(destination, newFilename);

      // Checking if the destination folder is inside the source folder.
      if (!folderIncludes(sourceAbsolute, destinationAbsolute)) {
        return copy(sourceAbsolute, destinationAbsolute, options);
      }
    }
  });

  await Promise.all(promises);

  return {
    numberOfFiles,
  };
};
