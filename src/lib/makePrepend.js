/**
 * Wraps an object as JSON inside a JavaScript constant.
 * @param {object} object The object to be included in the constant.
 */
module.exports = (object) => `const CONFIG = '${JSON.stringify(object)}';`;