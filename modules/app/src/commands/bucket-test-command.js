/* eslint-disable no-console */
const { executeCommand } = require('../util/execute-command');
const TestBucketGenerator = require('./bucket-generator-command');

class BucketTestCommand {
  constructor(program) {
    this.currentInstance = program.index || 0;
    this.bucketTotal = program.bucket || 1;
    this.testFileArray = new TestBucketGenerator(program).run();
    this.executionPath = program.executionDirectory || '.';
    this.testCommand = program.testCommand && program.testCommand.trim() + ' ';

    this.verbose = program.verbose || false;
  }

  run() {
    if (this.verbose) {
      console.log('%s/%s - Running Tests:\r\n%s\r\n', this.currentInstance, this.bucketTotal, this.testFileArray);
    }

    this.runTests();
  }

  runTests() {
    executeCommand(this.testCommand + this.testFileArray.join(' '), {
      cwd: this.executionPath,
      stdio: 'inherit',
    });
  }
}

module.exports = BucketTestCommand;
