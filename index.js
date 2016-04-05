(function() {
  'use strict';

  /**
   * No-op hook, executes with no modifications to the current event.
   *
   * @param {{}} data The currently modified data.
   * @param {Function} cb Asynchronous callback with the signature cb(error, shouldSave);
   * @returns {void}
   */
  function noop (data, cb) {
    cb(null, true);
  }

  module.exports = {
    /**
     * Called before any data is written, at the beginning of processing a change. If the callback
     * is called with an error or false, no more processing will be done for this change, and no
     * files will be written.
     */
    beforeAll: noop,

    /**
     * Called after all the data is written, at the end of processing a change. If there is no
     * error, the callback parameters are ignored.
     */
    afterAll: noop,

    /**
     * Called before writing an update to the top-level index.json.
     */
    globalIndexJson: noop,

    /**
     * Called before writing a package's main index.json.
     */
    indexJson: noop,

    /**
     * Called before writing the index.json for a particular package version.
     */
    versionJson: noop,

    /**
     * Called before downloading/verifying/writing a package tarball.
     */
    tarball: noop,

    /**
     * Called after downloading/verifying/writing a package tarball. If there is no error, the
     * callback parameters are ignored.
     */
    afterTarball: noop,

    /**
     * Called before doing anything else at start time.
     */
    startup: noop,

    /**
     * Called in order to check the sha1sum of a tarball. Calling back with true implies the shasum
     * passed. Default is in lib/defaultShasumCheck.js.
     */
    shasumCheck: noop
  };
})();
