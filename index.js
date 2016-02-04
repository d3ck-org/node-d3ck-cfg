'use strict'

var fs = require('fs')
var util = require('util')
var path = require('path')

var data = {}
var verbose = false

var log = function log (msg) {
  if (verbose) process.stderr.write(msg + '\n')
}

/**
* Initialization: Reads and exports the configuration values.
* @arg {object} [opts] - Options (see below)
* @arg {string} [opts.stage] - Set the stage, e.g. 'dev' to read cfg.dev.json after cfg.json
* @arg {string[]} [opts.cfgDirs=[]] - Additional cfg directories that contain JSON files
* @arg {boolean} [opts.verbose=false] - Enable verbose mode (prints the cfg search path)
* @arg {string} [opts.enc=utf-8] - Encoding of JSON cfg files
* @arg {string} [opts.myFilePath=process.argv[1]] - Script path, only needed when process.argv was changed (e.g. by a command line module)
* @arg {object} [data={}] - Additional cfg settings that overwrite the JSON values
* @example
* // set stage to 'prod' (reads cfg.json and cfg.prod.json files) and add two directories to cfg search path
* init({stage: 'prod', cfgDirs: ['/home/foo/etc1', '/home/foo/etc2']})
* // set stage to 'dev' and set the 'foo' and 'bar' cfg value
* init({stage: 'dev'}, {'foo': 1, 'bar': 2})
*/
function init (opts, moreData) {
  opts = opts || {}
  opts.enc = opts.enc || 'utf-8'
  opts.myFilePath = opts.myFilePath || process.argv[1]
  data = moreData || {}
  if (opts.verbose) verbose = true
  opts.stage = (opts.stage || process.env.NODED3CK_STAGE ||
                process.env.D3CK_STAGE || process.env.STAGE)
  if (opts.stage) data._stage = opts.stage
  data._cfgFiles = getCfgFiles(opts)
  data._cfgFiles.forEach(function (cfgFile) {
    log(util.format('Parsing %s', cfgFile))
    try {
      var cfgData = JSON.parse(fs.readFileSync(cfgFile, opts.enc))
      for (var attr in cfgData) data[attr] = cfgData[attr]
    } catch (err) {
      throw new Error(util.format('Parsing %s failed: %s', cfgFile, err))
    }
  })
  log(util.format('%s values added to cfg', Object.keys(data).length))
}

/**
* Get configuration value.
* @arg {string} [name] - Name of the cfg value, return all values if name isn't set
* @arg {object} [default] - Return this value (string, object, ...) if cfg value doesn't exist
* @return {object|null} All cfg values, one value or null
* @example
* // returns the whole cfg
* var all = get()
* // returns value of 'foo' or null if 'foo' isn't defined
* var foo = get('foo')
* // returns value of 'fooBar' or 123 if 'fooBar' isn't defined
* var fooBar = get('fooBar', 123)
*/
function get (name, dflt) {
  if (name == null) return data
  name = String(name)
  if (dflt == null) { dflt = null }      // force null, avoid undefined
  return (data[name] == null) ? dflt : data[name]
}

/**
* Get configuration value (join mode).
* @arg  {...string} [part] - Name parts of the cfg value (all parts except the first will be capitalized), return all values if no part is set
* @arg {object} [default] - Return the value of object's 'd' property (the 'd' property is mandatory) if cfg value doesn't exist
* @return {object|null} All cfg values, one value or null
* @example
* // returns the whole cfg, same as cfg.get()
* var all = jget()
* // returns value of 'foo' or null if 'foo' isn't defined, same as get('foo')
* var foo = jget('foo')
* // returns value of 'oneTwThr' or null if 'oneTwThr' isn't defined,
* // same as get('oneTwThr')
* var oneTwThr = jget('one', 'tw', 'thr')
* // returns value of 'fooBar' or 123 if 'fooBar' isn't defined,
* // same as get('fooBar', 123)
* var fooBar = jget('foo', 'bar', {d: 123})
*/
function jget () {
  var args = Array.prototype.slice.call(arguments) // convert to array
  var name = args.shift()
  if (name != null) name = String(name)
  var dflt = null
  if (args.length > 0) {
    var ilk = Object.prototype.toString.call(args[args.length - 1])
    if (ilk === '[object Object]') dflt = args.pop().d
    args.forEach(function (arg) {
      if (arg != null) {
        arg = String(arg)
        name += arg.charAt(0).toUpperCase() + arg.slice(1)
      }
    })
  }
  return get(name, dflt)
}

/**
* Set configuration value.
* @arg {(string|object)} name - Name of the cfg value (string mode) or object with cfg values and related names (object mode)
* @arg {object} [value] - Value (only needed but mandatory in string mode)
* @arg {object} [default] - Default if 'value' isn't defined (only needed in string mode)
* @return {object|null} All cfg values, one value (that can be null)
* @example
* // STRING MODE
* //   sets 'foo' to 123 and returns 123
* var foo = cfg.set('foo', 123)
* //   sets 'foo' to null and returns null
* var bar;
* foo = cfg.set('foo', bar)
* //   sets 'foo' to 456 and returns 456
* foo = cfg.set('foo', bar, 456)
*
* // OBJECT MODE
* //   sets 'foo' and 'bar' and returns the whole (not only 'foo' and 'bar') cfg
* var all = cfg.set({'foo': 1, 'bar': 2})
*/
function set () {
  var args = arguments
  if (args.length < 2) {
    for (var attr in args[0]) data[attr] = args[0][attr]
    return data
  }
  var value = args[1]
  var dflt = (args.length > 2) ? args[2] : null
  // force null, not undefined
  if (value == null) { value = (dflt == null) ? null : dflt }
  data[String(args[0])] = value
  return value
}

/**
* Check for active stage.
* @arg {string} [stage] - Check if this stage is active.
* @return {boolean} True if given stage is active, else false.
* @example
* set('_stage', 'test')
* get('_stage')                       // returns 'test'
* var isTestStage = isStage('test')   // returns true
* var isProdStage = isStage('prod')   // returns false
*/
function isStage (stage) {
  return data._stage === stage
}

/**
* @private
*/
function getCfgFiles (opts) {
  var stage = opts.stage
  var cfgFiles = []

  var fileExists = function fileExists (filePath) {
    try {
      fs.statSync(filePath)
      log(util.format('%s: Found', filePath))
      return true
    } catch (err) {
      log(util.format('%s: Not found', filePath))
    }
    return false
  }

  var addCfgFiles = function addCfgFiles (baseDir) {
    ;['cfg', ''].forEach(function (subDir) {
      var cfgFile = path.join(baseDir, subDir, 'cfg.json')
      if (fileExists(cfgFile)) cfgFiles.push(cfgFile)
      if (stage) {
        cfgFile = cfgFile.substring(0, cfgFile.length - 'json'.length) +
                  stage + '.json'
        if (fileExists(cfgFile)) cfgFiles.push(cfgFile)
      }
    })
  }

  if (typeof __dirname !== 'undefined') { addCfgFiles(__dirname) }
  ;['D3CK_CFG_DIRS', 'NODED3CK_CFG_DIRS'].forEach(function (envName) {
    if (process.env[envName]) {
      var confDirs = process.env[envName]
        .replace(/:+/g, ':').replace(/^:/, '').replace(/:$/, '')
        .split(':')
      confDirs.forEach(function (confDir) {
        addCfgFiles(confDir)
      })
    }
  })
  if (opts.myFilePath) addCfgFiles(path.dirname(opts.myFilePath))
  if (opts.cfgDirs) {
    opts.cfgDirs.forEach(function (cfgDir) {
      addCfgFiles(cfgDir)
    })
  }
  return cfgFiles
}

module.exports = {
  init: init,
  get: get,
  jget: jget,
  set: set,
  isStage: isStage
}
