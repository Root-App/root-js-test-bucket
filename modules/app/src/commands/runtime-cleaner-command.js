/* eslint-disable no-console */
const {
  findTestFiles,
  generateAbsoluteFilePath,
  parseRuntimeFile,
  writeRuntimeFile,
  DEFAULT_TEST_RUNTIME_FILE,
} = require('../util/file-util');

class RuntimeCleanerCommand {
  constructor(program) {
    this.executionPath = program.executionDirectory || '.';
    this.outputFile = program.outputFile || this.executionPath + '/' + DEFAULT_TEST_RUNTIME_FILE;
    this.inputFiles = program.inputFiles || [this.executionPath + '/' + DEFAULT_TEST_RUNTIME_FILE];

    this.testFileArray = [];
    if (program.testFiles && program.testFiles.length > 1) {
      this.testFileArray = program.testFiles;
    } else {
      this.testDirectoryBase = program.testFiles && program.testFiles.length === 1 ? program.testFiles : '.';
      this.testFileArray = findTestFiles(this.testDirectoryBase);
    }

    this.verbose = program.verbose || false;
  }

  run() {
    const existingRuntimeEntries = {};
    this.inputFiles.forEach((inputFile) => {
      const inputFileRuntimes = parseRuntimeFile(inputFile);

      Object.keys(inputFileRuntimes).forEach((runtimeFileName) => {
        const absoluteFilePath = generateAbsoluteFilePath(this.executionPath, runtimeFileName);

        if (this.testFileArray.includes(absoluteFilePath)) {
          Object.assign(existingRuntimeEntries, {
            [runtimeFileName]: inputFileRuntimes[runtimeFileName],
          });
        }
      });
    });
    writeRuntimeFile(this.executionPath, this.outputFile, existingRuntimeEntries);
  }
}

module.exports = RuntimeCleanerCommand;
