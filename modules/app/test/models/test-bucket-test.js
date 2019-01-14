const TestBucket = require('../../src/models/test-bucket');

describe('TestBucket', () => {
  describe('.addTest', () => {
    it('works', () => {
      const testBucket = new TestBucket();
      expect(testBucket.totalTestRuntimes).toEqual(0);
      expect(testBucket.testFiles.length).toEqual(0);

      testBucket.addTest('foo-test.js', 500);
      expect(testBucket.totalTestRuntimes).toEqual(500);
      expect(testBucket.testFiles.length).toEqual(1);

      testBucket.addTest('foo-test-1.js', 1000);
      expect(testBucket.totalTestRuntimes).toEqual(1500);
      expect(testBucket.testFiles.length).toEqual(2);
    });
  });
});
