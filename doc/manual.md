# node-d3ck-cfg

Lightweight configuration management for node.js applications based on JSON files

## Description

* [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg) returns a configuration (`cfg`) object whose values are derived from JSON files and `init()` parameters.
* `cfg` provides functions to get and change this configuration values easily across the whole application.

## Installation

    npm install node-d3ck-cfg

## Usage

Create the configuration files:

    $ cat /home/foo/etc/cfg.json
    {"webHost": "127.1.1.1", "webPort": 9468}

    $ cat /home/foo/etc/cfg.dev.json
    {"webHost": "127.2.2.2"}


Initialize the configuration:

    // main script
    [1]  var cfg = require('node-d3ck-cfg')
    //   cfg.init(<opts>, <data, e.g. from command line arguments>)
    [2]  cfg.init({stage: 'dev', cfgDirs: ['/home/foo/etc']},
                  {webPort: 4444, apiPort: 3333})

Set configuration values:

    // main script
    //   returns 127.4.4.4:
    [3]  var apiHostIp = cfg.set('apiHostIp', '127.4.4.4')
    //   returns all values:
    [4]  var all = cfg.set({'webPort': 8749, 'dbsPort': 8933})

    // module foo
    [1]  var cfg = require('node-d3ck-cfg')
    [2]  var dbsHost
    [3]  dbsHost = cfg.set('dbsHost', dbsHost))                // returns null
    [4]  dbsHost = cfg.set('dbsHost', dbsHost, '127.5.5.5'))   // returns 127.5.5.5

Get configuration values:

    // main script
    [5]  var all = cfg.get()                                   // returns all values
    [6]  var webHost = cfg.get('webHost')                      // returns 127.2.2.2
    [8]  webHost = cfg.jget('web', 'host')                     // same as [4]
    [9]  var webPort = cfg.get('webPort')                      // returns 8749

    // module bar
    [1]  var cfg = require('node-d3ck-cfg')
    [2]  var apiHost = cfg.get('apiHost')                      // returns null
    [3]  apiHost = cfg.get('apiHost', '127.3.3.3'))            // returns 127.3.3.3
    [4]  apiHost = cfg.jget('api', 'host', {d:'127.3.3.3'})    // same as [3]
    [5]  var apiHostIp = cfg.jget('api', 'host', 'ip')         // returns 127.4.4.4
    [6]  var apiPort = cfg.get('apiPort')                      // returns 3333
    [7]  var dbsHost = get('dbsHost')                          // returns 127.5.5.5

Please see the test script for a working example:

    $ cd /path/to/node-d3ck-cfg
    $ npm test               # same as "node test/test.js"

## Configuration files

 * The configuration values are stored in JSON format.
 * Configuration filenames are: `cfg.json` and `cfg.<stage>.json` (if stage is set)
 * This configuration files are searched in several directories (please see the section
   ___Search paths___)

### Flat vs. nested structure

A flat structure with camel case keys is preferred, because the values are easier to merge:

    # [1] flat version
    $ cat /home/foo/etc/cfg.json
    {"webIp": "127.2.2.2", "webPort": 4678, "apiIp": "127.1.1.1"}
    $ cat /home/foo/etc/cfg.dev.json
    {"apiIp": "127.3.3.3"}

    # node-d3ck-cfg converts this to
    {"webIp": "127.2.2.2", "webPort": 4678, "apiIp": "127.3.3.3"}

Instead of:

    # [2a] nested version
    $ cat /home/foo/etc/cfg.json
    {"hosts": {"webIp": "127.2.2.2", "webPort": 4678, "apiIp": "127.1.1.1"}}
    $ cat /home/foo/etc/cfg.dev.json
    {"hosts": {"apiIp": "127.3.3.3"}}

    # node-d3ck-cfg converts this to
    {"hosts": {"apiIp": "127.3.3.3"}}

So, if you want a nested structure, you have to define the whole _hosts_ object again:

    # [2b] nested version
    $ cat /home/foo/etc/cfg.json
    {"hosts": {"webIp": "127.2.2.2", "webPort": 4678, "apiIp": "127.1.1.1"}}
    $ cat /home/foo/etc/cfg.dev.json
    {"hosts": {"webIp": "127.2.2.2", "webPort": 4678, "apiIp": "127.3.3.3"}}

    # node-d3ck-cfg converts this to
    {"hosts": {"webIp": "127.2.2.2", "webPort": 4678, "apiIp": "127.3.3.3"}}

 After the initialization you can retrieve the values from [2] with `cfg.get()`:

    var apiIp = cfg.get('hosts').apiIp  // returns 127.3.3.3
    var key = 'apiIp'
    apiIp = cfg.get('hosts')[key]       // returns 127.3.3.3

[1] is prettier (better readable) with `cfg.get()` and `cfg.jget()`:

    var apiIp = cfg.get('apiIp')   // returns 127.3.3.3
    var key = 'apiIp'
    apiIp = cfg.get(key)           // returns 127.3.3.3
    ;['web', 'api', 'dbs'].forEach(function (hostName) {
      // returns 'unknown' for 'dbs':
      var host = cfg.jget(hostName, 'ip', 'unknown')
      // do something useful with host
    })

Of course, you can mix flat and nested structures.

### Search paths for configuration files

__When__ (all of this settings are optional)...
  * Enviroment variable `D3CK_STAGE` is set to `test`
      *  To set the variable in the _bash_ shell (Linux, Mac), run the following command: `export D3CK_STAGE="test"`
  * Enviroment variable `NODED3CK_STAGE` is set to `prod`
  * `init()` parameter `stage` is set to `dev`
  * Enviroment variable `D3CK_CFG_DIRS` is set to `/home/foo/etc5`
  * Enviroment variable `NODED3CK_CFG_DIRS` is set to `/home/foo/etc4:/home/foo/etc3`
  * `init()` parameter `cfgDirs` is set to `['/home/foo/etc2', '/home/foo/etc1']`

And...
  * [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg) is installed in `/home/foo/npm_modules/node-d3ck-cfg`
  * node.js script is `/home/foo/app.js`

__Then__...
  * The stage is `dev` because the enviroment variable `NODED3CK_STAGE` overwrites
    `D3CK_STAGE` and `init()` overwrites `NODED3CK_STAGE`.

And...

 `init()` reads the following files (latter overwrite former configuration values):

 ```
 1.   /home/foo/npm_modules/node-d3ck-cfg/cfg/cfg.json       // node-d3ck-cfg
 2.   /home/foo/npm_modules/node-d3ck-cfg/cfg/cfg.dev.json
 3.   /home/foo/npm_modules/node-d3ck-cfg/cfg.json
 4.   /home/foo/npm_modules/node-d3ck-cfg/cfg.dev.json
 5.   /home/foo/etc5/cfg/cfg.json                           // D3CK_CFG_DIRS
 6.   /home/foo/etc5/cfg/cfg.dev.json
 7.   /home/foo/etc5/cfg.json
 8.   /home/foo/etc5/cfg.dev.json
 9.   /home/foo/etc4/cfg/cfg.json                           // NODED3CK_CFG_DIR
 10.  /home/foo/etc4/cfg/cfg.dev.json
 11.  /home/foo/etc4/cfg.json
 12.  /home/foo/etc4/cfg.dev.json
 13.  /home/foo/etc3/cfg/cfg.json                           // NODED3CK_CFG_DIR
 14.  /home/foo/etc3/cfg/cfg.dev.json
 15.  /home/foo/etc3/cfg.json
 16.  /home/foo/etc3/cfg.dev.json
 17.  /home/foo/cfg/cfg.json                                // app.js directory
 18.  /home/foo/cfg/cfg.dev.json
 19.  /home/foo/cfg.json
 20.  /home/foo/cfg.dev.json
 17.  /home/foo/etc2/cfg/cfg.json                           // init parameter
 18.  /home/foo/etc2/cfg/cfg.dev.json
 19.  /home/foo/etc2/cfg.json
 20.  /home/foo/etc2/cfg.dev.json
 21.   /home/foo/etc1/cfg/cfg.json                          // init parameter
 22.  /home/foo/etc1/cfg/cfg.dev.json
 23.  /home/foo/etc1/cfg.json
 24.  /home/foo/etc1/cfg.dev.json
 ```

Set `init()` parameter `verbose` to print details about the search paths.

## See also

* [README](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/README.md)
* [API Reference](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md)
