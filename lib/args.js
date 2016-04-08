(function() {
  'use strict';

  var yargs = require('yargs');

  var options = yargs(process.argv);
  options.alias('dir', 'o');

  module.exports = options.argv;
})();
