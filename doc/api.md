## Functions

<dl>
<dt><a href="#init">init([opts], [data])</a></dt>
<dd><p>Initialization: Reads and exports the configuration values.</p>
</dd>
<dt><a href="#get">get([name], [default])</a> ⇒ <code>object</code> | <code>null</code></dt>
<dd><p>Get configuration value.</p>
</dd>
<dt><a href="#jget">jget([...part], [default])</a> ⇒ <code>object</code> | <code>null</code></dt>
<dd><p>Get configuration value (join mode).</p>
</dd>
<dt><a href="#set">set(name, [value], [default])</a> ⇒ <code>object</code> | <code>null</code></dt>
<dd><p>Set configuration value.</p>
</dd>
<dt><a href="#isStage">isStage([stage])</a> ⇒ <code>boolean</code></dt>
<dd><p>Check for active stage.</p>
</dd>
</dl>

<a name="init"></a>
## init([opts], [data])
Initialization: Reads and exports the configuration values.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>object</code> |  | Options (see below) |
| [opts.stage] | <code>string</code> |  | Set the stage, e.g. 'dev' to read cfg.dev.json     after cfg.json |
| [opts.cfgDirs] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Additional cfg directories that contain     JSON files |
| [opts.verbose] | <code>boolean</code> | <code>false</code> | Enable verbose mode (prints the cfg     search path) |
| [opts.enc] | <code>string</code> | <code>&quot;utf-8&quot;</code> | Encoding of JSON cfg files |
| [opts.myFilePath] | <code>string</code> | <code>&quot;process.argv[1]&quot;</code> | Script path, only needed     when process.argv was changed (e.g. by a command line module) |
| [data] | <code>object</code> | <code>{}</code> | Additional cfg settings that overwrite the JSON     values |

**Example**  
```js
// set stage to 'prod' (reads cfg.json and cfg.prod.json files) and
// add two directories to cfg search path
init({stage: 'prod', cfgDirs: ['/home/foo/etc1', '/home/foo/etc2']})
// set stage to 'dev' and set the 'foo' and 'bar' cfg value
init({stage: 'dev'}, {'foo': 1, 'bar': 2})
```
<a name="get"></a>
## get([name], [default]) ⇒ <code>object</code> &#124; <code>null</code>
Get configuration value.

**Kind**: global function  
**Returns**: <code>object</code> &#124; <code>null</code> - All cfg values, one value or null  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>string</code> | Name of the cfg value, return all values if name     isn't set |
| [default] | <code>object</code> | Return this value (string, object, ...) if cfg     value doesn't exist |

**Example**  
```js
// returns the whole cfg
var all = get()
// returns value of 'foo' or null if 'foo' isn't defined
var foo = get('foo')
// returns value of 'fooBar' or 123 if 'fooBar' isn't defined
var fooBar = get('fooBar', 123)
```
<a name="jget"></a>
## jget([...part], [default]) ⇒ <code>object</code> &#124; <code>null</code>
Get configuration value (join mode).

**Kind**: global function  
**Returns**: <code>object</code> &#124; <code>null</code> - All cfg values, one value or null  

| Param | Type | Description |
| --- | --- | --- |
| [...part] | <code>string</code> | Name parts of the cfg value (all parts except the     first will be capitalized), return all values if no part is set |
| [default] | <code>object</code> | Return the value of object's 'd' property (the     'd' property is mandatory) if cfg value doesn't exist |

**Example**  
```js
// returns the whole cfg, same as cfg.get()
var all = jget()
// returns value of 'foo' or null if 'foo' isn't defined, same as get('foo')
var foo = jget('foo')
// returns value of 'oneTwThr' or null if 'oneTwThr' isn't defined,
// same as get('oneTwThr')
var oneTwThr = jget('one', 'tw', 'thr')
// returns value of 'fooBar' or 123 if 'fooBar' isn't defined,
// same as get('fooBar', 123)
var fooBar = jget('foo', 'bar', {d: 123})
```
<a name="set"></a>
## set(name, [value], [default]) ⇒ <code>object</code> &#124; <code>null</code>
Set configuration value.

**Kind**: global function  
**Returns**: <code>object</code> &#124; <code>null</code> - All cfg values, one value (that can be null)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> &#124; <code>object</code> | Name of the cfg value (string mode) or object     with cfg values and related names (object mode) |
| [value] | <code>object</code> | Value (only needed but mandatory in string mode) |
| [default] | <code>object</code> | Default if 'value' isn't defined (only needed in     string mode) |

**Example**  
```js
// STRING MODE
//   sets 'foo' to 123 and returns 123
var foo = cfg.set('foo', 123)
//   sets 'foo' to null and returns null
var bar;
foo = cfg.set('foo', bar)
//   sets 'foo' to 456 and returns 456
foo = cfg.set('foo', bar, 456)

// OBJECT MODE
//   sets 'foo' and 'bar' and returns the whole (not only 'foo' and 'bar') cfg
var all = cfg.set({'foo': 1, 'bar': 2})
```
<a name="isStage"></a>
## isStage([stage]) ⇒ <code>boolean</code>
Check for active stage.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if given stage is active, else false.  

| Param | Type | Description |
| --- | --- | --- |
| [stage] | <code>string</code> | Check if this stage is active. |

**Example**  
```js
set('_stage', 'test')
get('_stage')                       // returns 'test'
var isTestStage = isStage('test')   // returns true
var isProdStage = isStage('prod')   // returns false
```
