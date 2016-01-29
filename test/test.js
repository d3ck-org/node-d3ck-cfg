'use strict'

var util = require('util')
var assert = require('assert')
var cfg = require('..')

var getAss = function getAss (key, result, dflt) {
  var name = key
  console.log('  %s -> %s', name, cfg.get(key, dflt))
  assert(cfg.get(key, dflt) === result, util.format('%s is %s', name, result))
}

var jgetAss = function jgetAss (name, key1, key2, result, dflt) {
  console.log('  %s -> %s', name, cfg.jget(key1, key2, dflt))
  assert(cfg.jget(key1, key2, dflt) === result,
         util.format('%s is %s', name, result))
}

var setAss = function setAss (key, value, result, dflt) {
  var name = key
  console.log('  %s -> %s', name, cfg.set(key, value, dflt))
  assert(cfg.get(key, value, dflt) === result, util.format('%s is %s', name, result))
}

var stage = 'dev'
console.log('Initialzing configuration for stage %s', stage)
cfg.init({stage: stage, cfgDirs: [__dirname], verbose: false},
         {'webPort': 9468})

console.log('\nGetting all configuration values with cfg.get():')
console.log(JSON.stringify(cfg.get(), null, 2))

console.log('\nGetting one configuration value with cfg.get(...):')
getAss('webHost', '127.2.2.2')
getAss('webPort', 9468)
getAss('apiHost', null)
getAss('apiHost', '127.3.3.3 (default set)', '127.3.3.3 (default set)')

console.log('\nGetting one configuration value with cfg.jget(...):')
jgetAss('webHost', 'web', 'host', '127.2.2.2')
jgetAss('webPort', 'web', 'Port', 9468)
jgetAss('apiHost', 'api', 'host', null)
jgetAss('apiHost', 'api', 'host', '127.3.3.3 (default set)',
        {d: '127.3.3.3 (default set)'})

console.log('\nSetting one configuration value with cfg.set(...):')
setAss('apiHost', '127.4.4.4', '127.4.4.4')
var dbsHost
setAss('dbsHost', dbsHost, null)
setAss('dbsHost', dbsHost, '127.5.5.5 (default set)', '127.5.5.5 (default set)')

console.log('\nSetting multiple configuration values with cfg.set(...):')
cfg.set({'fooHost': '127.6.6.6', 'barHost': '127.7.7.7'})  // returns whole cfg
getAss('fooHost', '127.6.6.6')
getAss('barHost', '127.7.7.7')

console.log('\nChecking for stage with cfg.isStage(...):')
console.log('  active stage -> prod => no')
assert(!cfg.isStage('prod'), 'active stage is prod but should be dev')
console.log('  active stage -> dev  => yes')
assert(cfg.isStage('dev'), 'active stage is not dev')

console.log('\nAll tests successfully passed')
