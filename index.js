(function() {
  'use strict';

  var options = require('./lib/args');
  var blobstore = require('fs-blob-store')(options.dir);

  function clone (instance) {
    return JSON.parse(JSON.stringify(instance));
  }

  function ensort (opts) {
    // First clone the instance.
    opts = clone(opts);

    if (typeof opts === 'string') {
      // Packages that start with alphanumerics are rewritten:
      // foo -> f/foo, bar -> b/bar
      return opts.replace(/^\/?([a-zA-Z0-9])/, function(match, submatch) {
        return match + '/' + submatch;
      });
    } else if (opts.hasOwnProperty('key')) {
      opts.key = ensort(opts.key); // Yes this is recursion, what of it?
    }

    return opts;
  }

  function desort (opts) {
    // Null check
    if (!opts) {
      return opts;
    }

    // First clone the instance.
    opts = clone(opts);

    if (typeof opts === 'string') {
      // Packages that start with alphanumerics are rewritten:
      // foo -> f/foo, bar -> b/bar
      return opts.replace(/^(\/?([a-zA-Z0-9]))\/\2/, function(match, s1) {
        return s1;
      });
    } else if (opts.hasOwnProperty('key')) {
      opts.key = desort(opts.key);
    }

    return opts;
  }

  module.exports = {
    createWriteStream: function(opts, cb) {
      return blobstore.createWriteStream(ensort(opts), function(results) {
        if (cb) {
          return cb(desort(results));
        }
      });
    },
    createReadStream: function(key, opts) {
      return blobstore.createReadStream(ensort(key), opts);
    },
    exists: function(opts, cb) {
      return blobstore.exists(ensort(opts), cb);
    },
    remove: function(opts, cb) {
      return blobstore.remove(ensort(opts), cb);
    }
  };
})();
