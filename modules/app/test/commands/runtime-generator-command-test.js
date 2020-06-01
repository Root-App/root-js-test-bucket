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

    it('works for jest output', () => {
      const command = new RuntimeGeneratorCommand(program);
      expect(command.parseTestRuntime('Time:        8ms')).toEqual(8);
      expect(command.parseTestRuntime('Time:        8.476s')).toEqual(8476);
      expect(command.parseTestRuntime('Time:        5.612m')).toEqual(336720);
    });
  });
});
