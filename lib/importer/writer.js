const {writeFile} = require('fs');
const {resolve} = require('path');
const {promisify} = require('util');


const writeFileAsync = promisify(writeFile);
const basePath = resolve(__dirname, '..', '..', 'exports');

module.exports = async function(data) {
  const timestamp = Date.now();
  const file = resolve(basePath, `${timestamp}.json`);
  return writeFileAsync(file, JSON.stringify(data, null, 2), 'utf-8');
};
