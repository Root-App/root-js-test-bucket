#!/usr/bin/env node
const { DEFAULT_TEST_RUNTIME_FILE } = require('../modules/app/src/util/file-util');
const BucketGeneratorCommand = require('../modules/app/src/commands/bucket-generator-command');
const BucketTestCommand = require('../modules/app/src/commands/bucket-test-command');
const RuntimeCleanerCommand = require('../modules/app/src/commands/runtime-cleaner-command');
const RuntimeGeneratorCommand = require('../modules/app/src/commands/runtime-generator-command');
const pkg = require('../package');
const program = require('commander');

function list(val) {
  return val.split(',');
}

program
  .version(pkg.version)
  .option('-g, --generate', 'Create a list of test files split in thier appropriate buckets. Multiple commands can be ran concurrently by specifying bucket and indexes.')
  .option('-t, --test', 'Run timed tests and collect results. Multiple commands can be ran concurrently by specifying bucket and indexes.')
  .option('--testFiles <files>', 'Required for --test, --clean: Base test directory location of the test files to include, or a list of comma separated test files.', list)
  .option('--testCommand <testCommand>', 'Required for --test: JS test command that will be used when performing testing runtime reports. Default: "yarn mocha " Ex: "yarn mocha --require test/setup-tests.js test/global-tests.js"')
  // .option('-i, --index <index>', 'The indicated index (zero based) out of a total specified bucket size.')
  // .option('-b, --bucket <bucketTotal>', 'Total specified bucket size.')
  .option('--executionDirectory <executionDirectory>', 'Base directory that of the test files to include.')
  .option('--outputFile <outputFile>', 'Output test runtime results to the following json file. Default: "./' + DEFAULT_TEST_RUNTIME_FILE)
  .option('--clean', 'Will remove entries from the runtime json for files that no longer exist.')
  .option('--inputFiles <files>', 'A list of comma separated runtime json file locations. Default: "./' + DEFAULT_TEST_RUNTIME_FILE, list)
  .option('--verbose', 'Log output to console as commands execute.')
  .parse(process.argv);

if (program.generate) {
  process.exit(new BucketGeneratorCommand(program).run());
} else if (program.test) {
  if (!program.testFiles) {
    // eslint-disable-next-line no-console
    console.error('--testFiles option required to run tests');
    process.exit(-1);
  }

  if (!program.testCommand) {
    // eslint-disable-next-line no-console
    console.error('--testCommand option required to run tests');
    process.exit(-1);
  }

  if (program.outputFile) {
    process.exit(new RuntimeGeneratorCommand(program).run());
  } else {
    process.exit(new BucketTestCommand(program, process.env.BUILDKITE_PARALLEL_JOB_COUNT, process.env.BUILDKITE_PARALLEL_JOB).run());
  }
} else if (program.clean) {
  process.exit(new RuntimeCleanerCommand(program).run());
}
