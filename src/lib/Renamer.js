const minimatch = require('minimatch');
const path = require('path');

/**
 * Provides methods for renaming files according to a set of instructions.
 */
module.exports = class Renamer {
  /**
   * Create a renamer.
   * @param {Object} config[] The configuration of the renamer.
   * @param {Array} config[].instructions An array containing instruction object (see readme for further information).
   * @param {Object} config[].data[] The data which should be inserted inplace of the placeholders.
   * @param {String} config[].data[].variation The name of the current variation according to the config of the plugin.
   */
  constructor({ instructions, data }) {
    this.renameInstructions = instructions;
    this.data = data;

    // Creating a filter for each rename instruction
    this.tests = this.renameInstructions.map(currentRename => minimatch.filter(currentRename.test));
  }

  /**
   * Get the rename instruction for a file according to the rename instructions in the config.
   * @param {String} file A base filename without the path and with the extension.
   * @return {String/null} The rename instruction as specified in the config of the plugin. Returns null if the file doesn't have to be renamed.
   */
  getInstruction(file) {
    // Looping over the tests.
    for (let i = 0; i < this.tests.length; i++) {
      // Testing if the current instruction applies to the file.
      let shouldRename = this.tests[i](file);

      if (shouldRename) {
        // Returning the rename instruction for a file.
        return this.renameInstructions[i].rename;
      }
    }
    return null;
  }

  /**
   * Change a filename using a instruction
   * @param {String} file A base filename without the path and with the extension.
   * @param {String} instruction The new filename with placeholders for variables.
   * @return {String} The new filename.
   */
  rename(file, instruction) {
    // Getting properties from the filename.
    let parsedFilename = path.parse(file);

    let newFilename = instruction;

    // Assembling the placeholder data.
    let data = {
      ...this.data,
      name: parsedFilename.name,
      extension: parsedFilename.ext,
      base: parsedFilename.base,
    };

    // Looping over the availabe placeholder
    for (let key in data) {
      let value = data[key];

      // Checking if the placeholder is in the new file name and replacinf it with the corresponding value.
      let placeholderString = `%${key}%`;
      newFilename = newFilename.replace(placeholderString, value);
    }

    return newFilename;
  }
};
