/* eslint-disable no-console */
const {
  DEFAULT_TEST_RUNTIME_FILE,
  generateAbsoluteFilePath,
  parseRuntimeFile,
  writeRuntimeFile,
} = require('../util/file-util');
const TestBucketGenerator = require('./bucket-generator-command');

class RuntimeCleanerCommand {
  constructor(program) {
    this.executionPath = program.executionDirectory || '.';
    this.outputFile = program.outputFile || this.executionPath + '/' + DEFAULT_TEST_RUNTIME_FILE;
    this.inputFiles = program.inputFiles || [this.executionPath + '/' + DEFAULT_TEST_RUNTIME_FILE];
    this.testFileArray = new TestBucketGenerator(program).run();
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
