class TestBucket {
  constructor() {
    this.totalTestRuntimes = 0.0;
    this.testFiles = [];
  }

  addTest(testFileName, testRuntime) {
    this.totalTestRuntimes += testRuntime;
    this.testFiles.push(testFileName);
  }
}

module.exports = TestBucket;
