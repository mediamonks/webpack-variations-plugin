const util = require('util');
const fs = require('fs');
fs.readdir = util.promisify(fs.readdir);
const { copy } = require('fs-extra');
const path = require('path');
const minimatch = require('minimatch');
const folderIncludes = require('./folderIncludes');

const MINIMATCH_OPTIONS = {
  dot: true,
};

module.exports = async (source, destination, ignore) => {
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
  let promises = files.map(file => {
    if (filterAll(file)) {
      let sourceAbsolute = path.join(source, file);
      let destinationAbsolute = path.join(destination, file);

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
