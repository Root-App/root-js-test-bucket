const RuntimeGeneratorCommand = require('../../src/commands/runtime-generator-command');
const program = require('commander');

describe('RuntimeGeneratorCommand', () => {
  describe('.parseTestRuntime', () => {
    it('works for mocha output', () => {
      const command = new RuntimeGeneratorCommand(program);
      expect(command.parseTestRuntime('1 passing (6ms)')).toEqual(6);
      expect(command.parseTestRuntime('1 passing (1s)')).toEqual(1000);
      expect(command.parseTestRuntime('1 passing (1m)')).toEqual(60000);
    });

    it('works for jest output with padded runtimes', () => {
      const command = new RuntimeGeneratorCommand(program);
      expect(command.parseTestRuntime('Total Test Run Time: 8ms')).toEqual(2008);
      expect(command.parseTestRuntime('Total Test Run Time: 8.476s')).toEqual(10476);
      expect(command.parseTestRuntime('Total Test Run Time: 5.612m')).toEqual(338720);
    });
  });
});
