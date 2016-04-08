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

  var mockery = require('mockery');

  var testData = {
    '-/index.json': '-/index.json',
    '-/404.json': '-/404.json',
    'black/index.json': 'b/black/index.json',
    'black/latest/index.json': 'b/black/latest/index.json',
    'black/0.3.0/index.json': 'b/black/0.3.0/index.json',
    'black/-/black-0.3.0.tgz': 'b/black/-/black-0.3.0.tgz',
    '/-/index.json': '/-/index.json',
    '/-/404.json': '/-/404.json',
    '/black/index.json': '/b/black/index.json',
    '/black/latest/index.json': '/b/black/latest/index.json',
    '/black/0.3.0/index.json': '/b/black/0.3.0/index.json',
    '/black/-/black-0.3.0.tgz': '/b/black/-/black-0.3.0.tgz'
  };

  var mockBlobStore = {
    createWriteStream: function(opts, cb) {
      if (cb) {
        return cb(opts);
      }
    },
    createReadStream: function() {
    },
    exists: function(opts, cb) {
      if (cb) {
        return cb(opts);
      }
    },
    remove: function(opts, cb) {
      if (cb) {
        return cb(opts);
      }
    }
  };

  describe('afs-blob-store', function() {

    beforeEach(function(done) {
      mockery.registerMock('fs-blob-store', function() {
        return mockBlobStore;
      });
      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });
      mockery.resetCache();
      done();
    });

    afterEach(function(done) {
      mockery.disable();
      mockery.deregisterAll();
      done();
    });

    it('should rewrite the path on createWriteStream', function() {
      var spy = spyOn(mockBlobStore, 'createWriteStream').and.callThrough();
      var blobstore = require('../index');

      for (var key in testData) {
        if (!testData.hasOwnProperty(key)) {
          continue;
        }

        blobstore.createWriteStream(key);
        expect(spy.calls.mostRecent().args[0]).toEqual(testData[key]);
        expect(spy.calls.count()).toEqual(1);
        spy.calls.reset();

        blobstore.createWriteStream({key: key});
        expect(spy.calls.mostRecent().args[0]).toEqual({key: testData[key]});
        expect(spy.calls.count()).toEqual(1);
        spy.calls.reset();
      }
    });

    it('should decode the path on createWriteStream\'s callback', function() {
      var cbSpy = spyOn(mockBlobStore, 'createWriteStream').and.callFake(function(opts, cb) {
        if (typeof opts === 'string') {
          return cb({key: opts});
        } else {
          return cb(opts);
        }
      });
      var spy = jasmine.createSpy('spy');
      var blobstore = require('../index');

      for (var key in testData) {
        if (!testData.hasOwnProperty(key)) {
          continue;
        }

        blobstore.createWriteStream(key, spy);
        expect(cbSpy.calls.mostRecent().args[0]).toEqual(testData[key]);
        expect(spy.calls.mostRecent().args[0]).toEqual({key: key});
        expect(cbSpy.calls.count()).toEqual(1);
        expect(spy.calls.count()).toEqual(1);
        cbSpy.calls.reset();
        spy.calls.reset();

        blobstore.createWriteStream({key: key}, spy);
        expect(cbSpy.calls.mostRecent().args[0]).toEqual({key: testData[key]});
        expect(spy.calls.mostRecent().args[0]).toEqual({key: key});
        expect(cbSpy.calls.count()).toEqual(1);
        expect(spy.calls.count()).toEqual(1);
        cbSpy.calls.reset();
        spy.calls.reset();
      }
    });

    it('should decode a newly created path on createWriteStream\'s callback', function() {
      var supernewPath = '/supernewpath/supernewpath.tgz';

      var cbSpy = spyOn(mockBlobStore, 'createWriteStream').and.callFake(function(opts, cb) {
        return cb({
          key: '/s' + supernewPath
        });
      });
      var spy = jasmine.createSpy('spy');
      var blobstore = require('../index');

      blobstore.createWriteStream({}, spy);
      expect(cbSpy.calls.mostRecent().args[0]).toEqual({});
      expect(spy.calls.mostRecent().args[0]).toEqual({key: supernewPath});
      expect(cbSpy.calls.count()).toEqual(1);
      expect(spy.calls.count()).toEqual(1);
      cbSpy.calls.reset();
      spy.calls.reset();
    });

    it('should not decode anything if createWriteStream does not create a new path', function() {
      var cbSpy = spyOn(mockBlobStore, 'createWriteStream').and.callFake(function(opts, cb) {
        return cb({});
      });
      var spy = jasmine.createSpy('spy');
      var blobstore = require('../index');

      blobstore.createWriteStream({}, spy);
      expect(cbSpy.calls.mostRecent().args[0]).toEqual({});
      expect(spy.calls.mostRecent().args[0]).toEqual({});
      expect(cbSpy.calls.count()).toEqual(1);
      expect(spy.calls.count()).toEqual(1);
      cbSpy.calls.reset();
      spy.calls.reset();
    });

    it('should not fail if createWriteStream callback receives no params', function() {
      var cbSpy = spyOn(mockBlobStore, 'createWriteStream').and.callFake(function(opts, cb) {
        return cb();
      });
      var spy = jasmine.createSpy('spy');
      var blobstore = require('../index');

      blobstore.createWriteStream({}, spy);
      expect(cbSpy.calls.mostRecent().args[0]).toEqual({});
      expect(spy.calls.mostRecent().args[0]).toBeUndefined();
      expect(cbSpy.calls.count()).toEqual(1);
      expect(spy.calls.count()).toEqual(1);
      cbSpy.calls.reset();
      spy.calls.reset();
    });

    it('should rewrite the path on createReadStream', function() {
      var spy = spyOn(mockBlobStore, 'createReadStream').and.callThrough();
      var blobstore = require('../index');

      for (var key in testData) {
        if (!testData.hasOwnProperty(key)) {
          continue;
        }

        blobstore.createReadStream(key);
        expect(spy.calls.mostRecent().args[0]).toEqual(testData[key]);
        expect(spy.calls.count()).toEqual(1);
        spy.calls.reset();

        blobstore.createReadStream({key: key});
        expect(spy.calls.mostRecent().args[0]).toEqual({key: testData[key]});
        expect(spy.calls.count()).toEqual(1);
        spy.calls.reset();
      }
    });

    it('should rewrite the path on exists', function() {
      var spy = spyOn(mockBlobStore, 'exists').and.callThrough();
      var blobstore = require('../index');

      for (var key in testData) {
        if (!testData.hasOwnProperty(key)) {
          continue;
        }

        blobstore.exists(key);
        expect(spy.calls.mostRecent().args[0]).toEqual(testData[key]);
        expect(spy.calls.count()).toEqual(1);
        spy.calls.reset();

        blobstore.exists({key: key});
        expect(spy.calls.mostRecent().args[0]).toEqual({key: testData[key]});
        expect(spy.calls.count()).toEqual(1);
        spy.calls.reset();
      }
    });

    it('should rewrite the path on remove', function() {
      var spy = spyOn(mockBlobStore, 'remove').and.callThrough();
      var blobstore = require('../index');

      for (var key in testData) {
        if (!testData.hasOwnProperty(key)) {
          continue;
        }

        blobstore.remove(key);
        expect(spy.calls.mostRecent().args[0]).toEqual(testData[key]);
        expect(spy.calls.count()).toEqual(1);
        spy.calls.reset();

        blobstore.remove({key: key});
        expect(spy.calls.mostRecent().args[0]).toEqual({key: testData[key]});
        expect(spy.calls.count()).toEqual(1);
        spy.calls.reset();
      }
    });
  });
})();
