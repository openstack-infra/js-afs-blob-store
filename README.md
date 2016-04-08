# sorting-fs-blob-store

This project provides a renaming shim on top of fs-blob-store, to permit the storing of large folders on AFS.

AFS has a practical folder size limit of ~64K entries. In order to accomodate folders with more files than this (such as the npm registry), we store them in subfolders, sorted by the first letter of the package name. For example: `/foo` becomes `/f/foo`, `/bar` becomes `/b/bar`, `/q` becomes `/q/q`. Only files that begin with alphanumeric characters are sorted.

Accessing these files via sorting-fs-blob-store is transparent. Accessing them via other methods can be accomplished via rewrite rules (for instance, apache's mod_rewrite).

This module is in use by OpenStack's Infrastructure team, to run the npm portion of our unified mirrors.

### QuickStart

	#!/bin/bash
	
	# Install the registry and the hook module.
	npm install -g registry-static registry-static-afs
	
	# Run the registry script
	registry-static -d my.registry.com -o /var/www/registry \
		--blobstore sorting-fs-blob-store

### Some useful development commands

* `npm test` - Run all the tests, with coverage.
* `npm run lint` - Perform a linting check.

### Project Resources

  - [Source code](https://git.openstack.org/cgit/openstack/js-registry-static-afs)
  - [How to contribute to OpenStack](http://docs.openstack.org/infra/manual/developers.html)
  - [Code review workflow](http://docs.openstack.org/infra/manual/developers.html#development-workflow)
  - IRC: \#openstack-infra on \#freenode