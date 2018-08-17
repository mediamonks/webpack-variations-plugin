/**
 * Wraps an object as JSON inside a JavaScript constant.
 * @param {String} constantName The object to be included in the constant.
 * @param {object} object The object to be included in the constant.
 */
module.exports = (constantName, object) => `const ${constantName} = ${JSON.stringify(object)};`;
