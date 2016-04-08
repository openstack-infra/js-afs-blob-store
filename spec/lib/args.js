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

  var argsLibPath = '../../lib/args';

  describe('args', function() {
    var actualArgs;

    beforeEach(function(done) {
      // Store argv so we can modify it in our tests.
      actualArgs = process.argv;
      done();
    });

    afterEach(function(done) {
      // Reset the old argv.
      process.argv = actualArgs;

      // Delete the cached entry so we reparse with new args.
      delete require.cache[require.resolve(argsLibPath)];
      done();
    });

    it('should accept the --dir flag', function(done) {
      process.argv = [
        'node',
        'asdfasda',
        '--dir',
        './foo'
      ];
      var args = require(argsLibPath);
      expect(args.dir).toBe('./foo');
      done();
    });

    it('should accept the --o flag', function(done) {
      process.argv = [
        'node',
        'asdfasda',
        '-o',
        './bar'
      ];
      var args = require(argsLibPath);
      expect(args.o).toBe('./bar');
      expect(args.dir).toBe('./bar');
      done();
    });
  });
})();
