const { executeCommand } = require('../util/execute-command');
const fs = require('fs');
const path = require('path');

const DEFAULT_TEST_RUNTIME_FILE_PREFIX = 'js-test-runtime';
const DEFAULT_TEST_RUNTIME_FILE = DEFAULT_TEST_RUNTIME_FILE_PREFIX + '.json';

function findTestFiles(testDirectory = '.') {
  const findCommandOutput = executeCommand('find ' + testDirectory + ' -path ./node_modules -prune -o -type f -name "*test.js"');
  const testFileArray = _generateFormattedFindFilePaths(findCommandOutput.toString());
  return testFileArray.filter((file) => !!file);
}

function generateAbsoluteFilePath(executionPath, relativeFilePath) {
  return path.join(executionPath, relativeFilePath);
}

function generateRelativeFilePath(executionPath, filePath) {
  return path.relative(executionPath, filePath);
}

function parseRuntimeFile(runtimeFile = DEFAULT_TEST_RUNTIME_FILE) {
  const testRuntimeFilePath = path.resolve(runtimeFile);
  if (fs.existsSync(testRuntimeFilePath)) {
    return JSON.parse(fs.readFileSync(path.resolve(runtimeFile)));
  }
  return {};
}

function writeRuntimeFile(executionPath, outputFile = DEFAULT_TEST_RUNTIME_FILE, testRuntimeObject = {}) {
  const jsonRuntimeFile = _generateOrderedRuntimesFileString(testRuntimeObject);
  fs.writeFileSync(path.resolve(executionPath, outputFile), jsonRuntimeFile);
}

function _generateFormattedFindFilePaths(findCommandOutputString) {
  return findCommandOutputString
    .trim()
    .replace(/\.\//gi, '')
    .replace(/\/\//gi, '/')
    .split(/\r?\n/);
}

function _generateOrderedRuntimesFileString(testRuntimeObject) {
  let fileString = '{\n';
  const fileSpacer = '  ';

  const sortedRuntimeKeys = Object.keys(testRuntimeObject).sort((a, b) => testRuntimeObject[b] - testRuntimeObject[a]);
  sortedRuntimeKeys.forEach((runtimeKey, index) => {
    fileString += `${fileSpacer}"${runtimeKey}": ${testRuntimeObject[runtimeKey]}`;
    if (index !== sortedRuntimeKeys.length - 1) {
      fileString += ',';
    }
    fileString += '\n';
  });

  fileString += '}\n';
  return fileString;
}

module.exports = {
  findTestFiles,
  generateAbsoluteFilePath,
  generateRelativeFilePath,
  parseRuntimeFile,
  writeRuntimeFile,
  DEFAULT_TEST_RUNTIME_FILE,
  DEFAULT_TEST_RUNTIME_FILE_PREFIX,
};
