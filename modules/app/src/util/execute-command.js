const execSync = require('child_process').execSync;

function executeCommand(command, options = {}) {
  return execSync(
    command,
    options
  );
}

module.exports = {
  executeCommand,
};
