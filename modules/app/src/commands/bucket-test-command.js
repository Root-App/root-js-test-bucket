/* eslint-disable no-console */
const { executeCommand } = require('../util/execute-command');
const TestBucketGenerator = require('./bucket-generator-command');

class BucketTestCommand {
  constructor(program, bucketTotal, bucketIndex) {
    this.currentInstance = bucketIndex || 0;
    this.bucketTotal = bucketTotal || 1;
    this.testFileArray = new TestBucketGenerator(program).run();
    this.executionPath = program.executionDirectory || '.';
    this.testCommand = program.testCommand && program.testCommand.trim() + ' ';

    this.verbose = program.verbose || false;
  }

  run() {
    if (this.verbose) {
      console.log('%s/%s - Running Tests:\r\n%s\r\n', this.currentInstance, this.bucketTotal, this.testFileArray);
    }

    return this.runTests();
  }

  runTests() {
    try {
      executeCommand(this.testCommand + this.testFileArray.join(' '), {
        cwd: this.executionPath,
        stdio: 'inherit',
      });
      return 0;
    } catch (error) {
      return 1;
    }
  }
}

module.exports = BucketTestCommand;
