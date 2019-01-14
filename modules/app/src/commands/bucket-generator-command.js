/* eslint-disable no-console */
const {
  findTestFiles,
  parseRuntimeFile,
  DEFAULT_TEST_RUNTIME_FILE,
} = require('../util/file-util');
const TestBucket = require('../models/test-bucket');

class BucketGeneratorCommand {
  constructor(program) {
    this.currentInstance = program.index || 0;
    this.bucketTotal = program.bucket || 1;

    this.testFileArray = [];
    if (program.testFiles && program.testFiles.length > 1) {
      this.testFileArray = program.testFiles;
    } else {
      this.testDirectoryBase = program.testFiles && program.testFiles.length === 1 ? program.testFiles : '.';
      this.testFileArray = findTestFiles(this.testDirectoryBase);
    }

    this.executionPath = program.executionDirectory || '.';
    this.outputFile = program.outputFile || this.executionPath + '/' + DEFAULT_TEST_RUNTIME_FILE;

    this.verbose = program.verbose || false;
  }

  run() {
    if (this.verbose) {
      console.log('%s/%s - Generating Bucket For Test Directory %s:\r\n', this.currentInstance, this.bucketTotal, this.testDirectoryBase);
    }

    // Load all runtime jsons into memory
    const testRuntimes = parseRuntimeFile(this.outputFile);
    // if (this.verbose) {
    //   console.log('\r\nTest Runtimes Merged: %s\r\n', JSON.stringify(testRuntimes, null, 2));
    // }

    // Calculate the average test runtime
    const averageRuntime = Object.keys(testRuntimes).reduce((runtimeTotal, runtimeDataKey) => {
      return runtimeTotal += testRuntimes[runtimeDataKey];
    }, 0) / (Object.keys(testRuntimes).length || 1) || 1;
    // if (this.verbose) {
    //   console.log('Average Runtime Calculated: %s\r\n', averageRuntime);
    // }

    // Add all files without a reported time
    this.testFileArray.forEach((currentFileName) => {
      if (!testRuntimes[currentFileName]) {
        // if (this.verbose) {
        //   console.log('Runtime Entry for %s not found. Adding average runtime.', currentFileName);
        // }
        testRuntimes[currentFileName] = averageRuntime;
      }
    });
    // if (this.verbose) {
    //   console.log('\r\nPrepared Runtimes: %s\r\n', JSON.stringify(testRuntimes, null, 2));
    // }

    const sortBuckets = (a, b) => {
      return Number.parseFloat(a.totalTestRuntimes) - Number.parseFloat(b.totalTestRuntimes);
    };

    const sortRuntimesDsc = (a, b) => {
      return Number.parseFloat(b.testRuntime) - Number.parseFloat(a.testRuntime);
    };

    const bucketArray = [];
    for (let i = 0; i < this.bucketTotal; i++) {
      bucketArray.push(new TestBucket());
    }

    const testRuntimesArray = [];
    this.testFileArray.forEach((testFile) => {
      const runtimeData = testRuntimes[testFile];
      testRuntimesArray.push({
        testFileName: testFile,
        testRuntime: runtimeData,
      });
    });

    testRuntimesArray.sort(sortRuntimesDsc).forEach((runtimeData) => {
      const nextSmallestBucket = bucketArray.sort(sortBuckets)[0];
      nextSmallestBucket.addTest(runtimeData.testFileName, runtimeData.testRuntime);
    });
    // if (this.verbose) {
    //   console.log('Generated Bucket Array: %s\r\n', JSON.stringify(bucketArray, null, 2));
    // }

    // Return list of files in the current bucket
    const bucketData = bucketArray[this.currentInstance];

    const yarnTestFiles = bucketData.testFiles.join(' ');
    console.log(yarnTestFiles);

    return bucketData.testFiles;
  }
}

module.exports = BucketGeneratorCommand;
