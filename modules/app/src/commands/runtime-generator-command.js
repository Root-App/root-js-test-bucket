/* eslint-disable no-console */
const { executeCommand } = require('../util/execute-command');
const TestBucketGenerator = require('./bucket-generator-command');
const {
  DEFAULT_TEST_RUNTIME_FILE,
  generateRelativeFilePath,
  parseRuntimeFile,
  writeRuntimeFile,
} = require('../util/file-util');

class RuntimeGeneratorCommand {
  constructor(program) {
    this.currentInstance = program.index || 0;
    this.bucketTotal = program.bucket || 1;
    this.testFileArray = new TestBucketGenerator(program).run();
    this.executionPath = program.executionDirectory || '.';
    this.outputFile = program.outputFile || this.executionPath + '/' + DEFAULT_TEST_RUNTIME_FILE;
    this.testCommand = program.testCommand && program.testCommand.trim() + ' ';

    this.verbose = program.verbose || false;
  }

  run() {
    if (this.verbose) {
      console.log('%s/%s - Running Tests:\r\n%s\r\n', this.currentInstance, this.bucketTotal, this.testFileArray);
    }

    const testRuntimes = {};
    const testFailureArray = [];
    this.testFileArray.forEach((currentTestFile, index, array) => {
      console.log('%s/%s: Starting Test: %s\r\n', index + 1, array.length, currentTestFile);
      const testData = this.runTest(currentTestFile);
      if (testData.error) {
        testFailureArray.push(currentTestFile);
      } else {
        Object.assign(testRuntimes, testData);
      }
    });

    console.log('\r\nWriting Runtimes to File: %s\r\n', this.outputFile);
    if (this.verbose) {
      console.log(JSON.stringify(testRuntimes, null, 2));
    }

    const previousRuntimes = parseRuntimeFile(this.outputFile);
    writeRuntimeFile(this.executionPath, this.outputFile, Object.assign(previousRuntimes, testRuntimes));
    console.log('\r\nWriting Successful');

    if (testFailureArray.length > 0) {
      console.error('Failed Tests: %s', testFailureArray.toString());
      return 2;
    } else {
      return 0;
    }
  }

  parseTestOutput(runtimeRegEx, testOutput) {
    const runtimeMatch = testOutput.match(runtimeRegEx);
    let runtimeValue = Number.parseFloat(runtimeMatch[1]);
    if (runtimeMatch[2] === 's') {
      runtimeValue *= 1000;
    } else if (runtimeMatch[2] === 'm') {
      runtimeValue *= 60 * 1000;
    }
    return runtimeValue;
  }

  parseTestRuntime(testOutput) {
    const mochaRuntimeRegEx = new RegExp(/^.* passing \((\d*)(ms|m|s)\)/, 'm');
    const jestRuntimeRegEx = new RegExp(/^.*Total Test Run Time:.*?(\d*\.?\d*?)(ms|m|s)/, 'm');

    if (jestRuntimeRegEx.test(testOutput)) {
      return this.parseTestOutput(jestRuntimeRegEx, testOutput);
    }

    if (mochaRuntimeRegEx.test(testOutput)) {
      return this.parseTestOutput(mochaRuntimeRegEx, testOutput);
    }
  }

  runTest(testFileName) {
    if (testFileName) {
      try {
        const testCommandOutput = executeCommand(this.testCommand + testFileName, {
          cwd: this.executionPath,
        });
        const testOutput = testCommandOutput.toString();
        const testRuntime = this.parseTestRuntime(testOutput.toString());
        const testRuntimeKey = generateRelativeFilePath(this.executionPath, testFileName);
        return {
          [testRuntimeKey]: testRuntime,
        };
      } catch (error) {
        console.error('Error Message: %s', error.message);
        console.error('Error Output: %s', error.stdout.toString());
        return {
          error,
        };
      }
    }
  }
}

module.exports = RuntimeGeneratorCommand;
