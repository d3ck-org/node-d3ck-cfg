[![npm Version](https://img.shields.io/npm/v/node-d3ck-cfg.svg)](https://www.npmjs.com/package/node-d3ck-cfg)
[![JS-Standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://api.travis-ci.org/d3ck-org/node-d3ck-cfg.svg?branch=master)](https://travis-ci.org/d3ck-org/node-d3ck-cfg)
[![Dependency Status](https://david-dm.org/d3ck-org/node-d3ck-cfg.svg)](https://david-dm.org/d3ck-org/node-d3ck-cfg)

# node-d3ck-cfg

Lightweight configuration management for node.js applications based on JSON files

**Please note** the major version of this module: [Major version zero (0.y.z) is for initial development. Anything may change at any time. The public API should not be considered stable.](http://semver.org/#spec-item-4).

## Features

* Exports a central `cfg` object (shareable across the whole application)
* Supports staging
* Supports environment variables and `init()` arguments to define stage and
  configuration directories
* Features a flat configuration structure with camel case keys (nested structures also possible)
* No extra module dependencies
* Well documented (readme, manual and API reference)

## Installation

    npm install node-d3ck-cfg

## Usage example

Configuration files:

    $ cat /home/foo/etc/cfg.json
    {"webHost": "127.1.1.1", "webPort": 9468}

    $ cat /home/foo/etc/cfg.dev.json
    {"webHost": "127.2.2.2"}

Initialize the configuration and set additional values:

    // main script
    [1]  var cfg = require('node-d3ck-cfg')
    [2]  cfg.init({stage: 'dev', cfgDirs: ['/home/foo/etc']})
    [3]  var dbsHost = cfg.set('dbsHost', '127.4.4.4')         // returns 127.4.4.4
    [4]  var all = cfg.set({webPort: 7364, dbsPort: 3236})     // returns all cfg values

Get configuration values:

    // main script
    [5]  var webPort = cfg.get('webPort')                 // returns 7364

    // module foo
    [1]  var cfg = require('node-d3ck-cfg')
    [2]  var all = cfg.get()                              // returns all cfg values
    [3]  var webHost = cfg.get('webHost')                      // returns 127.2.2.2
    [4]  webHost = cfg.jget('web', 'host')                     // same as [3]
    [5]  var apiHostIp = cfg.get('apiHostIp')                  // returns null
    [6]  apiHostIp = cfg.jget('api', 'host', 'ip')             // same as [5]
    [7]  apiHostIp = cfg.get('apiHostIp', '127.3.3.3'))        // returns 127.3.3.3
    [8]  apiHostIp = cfg.jget('api', 'host', 'ip', {d:'127.3.3.3'})  // same as [7]
    [9]  var dbsHost = cfg.get('dbsHost')                      // returns 127.4.4.4

## Documentation

* [User Manual](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/manual.md)
* [API Reference](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md)

## See also / Credits

* [js-standard](https://github.com/feross/standard)
* [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)
* [node-d3ck-bstrap](https://github.com/d3ck-org/node-d3ck-bstrap)
* [node-d3ck-log](https://github.com/d3ck-org/node-d3ck-log)
