const pkg = require('./package');

module.exports = {
  'plugins': [
    'root',
  ],
  'extends': [
    'plugin:root/recommended',
    'plugin:root/jest',
  ],
  'rules': {
    'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
  }
};
