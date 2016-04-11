/*
 * Copyright (c) 2016 Hewlett Packard Enterprise Development Company, LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
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
