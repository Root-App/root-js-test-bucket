# root-js-test-bucket

A utility to run JS based tests and save output for concurrent CI builds to split tests evenly.

## Commands:
### -g, --generate
Create a list of test files split in thier appropriate buckets. Multiple commands can be ran concurrently by specifying bucket and indexes.

### -t, --test
Run timed tests and collect results. Multiple commands can be ran concurrently by specifying bucket and indexes.

__--testFiles <a>..<b>__\
Required for --test, --clean: Base test directory location of the test files to include, or a list of comma separated test files/directories.

__--testCommand <testCommand>__\
Required for --test: JS test command that will be used when performing testing runtime reports. Ex: "yarn mocha --require test/setup-tests.js test/global-tests.js"

__--outputFile <outputFile>__\
If ommitted, test runtimes will not be generated and tests will just be bucketed appropriately.
Output test runtime results to the following json file. Default: "./js-test-runtime.json"

### --clean
Will remove entries from the runtime json for files that no longer exist.

__--inputFiles <a>..<b>__\
A list of comma separated runtime json file locations. Default: "./js-test-runtime.json"

## Universal Flags:
__-i, --index <index>__\
The indicated index (zero based) out of a total specified bucket size.

__-b, --bucket <bucketTotal>__\
Total specified bucket size.

__--executionDirectory <executionDirectory>__\
Base directory that of the test files to include.

__--verbose__\
Log output to console as commands execute.
