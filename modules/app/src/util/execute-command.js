const execSync = require('child_process').execSync;

function executeCommand(command) {
  return execSync(command);
}

module.exports = {
  executeCommand,
};
