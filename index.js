(function() {
  'use strict';

  var options = require('./lib/args');
  var blobstore = require('fs-blob-store')(options.dir);

  function afsify (opts) {
    if (typeof opts === 'string') {
      // Packages that start with alphanumerics are rewritten:
      // foo -> f/foo, bar -> b/bar
      opts = opts.replace(/^\/?([a-zA-Z0-9])/, function(match, submatch) {
        return submatch + '/' + submatch;
      });
      return opts;
    }

    return opts;
  }

  module.exports = {
    createWriteStream: function(opts, cb) {
      return blobstore.createWriteStream(afsify(opts), cb);
    },
    createReadStream: function(key, opts) {
      return blobstore.createReadStream(afsify(key), opts);
    },
    exists: function(opts, cb) {
      return blobstore.exists(afsify(opts), cb);
    },
    remove: function(opts, cb) {
      return blobstore.remove(afsify(opts), cb);
    }
  };
})();
