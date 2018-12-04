## keyfob

this is a simple little module that allows you to run a function on a tree of files, and get an object as a result.

for example, given the following directory structure:

```
files/one.txt
files/deeper/two.txt
files/another.txt
```

and this code:

```js
const Keyfob = require('keyfob');
const results = Keyfob.load({ path: 'files' });
```

you would get this result:

```js
{
  one: 'contents of one.txt',
  deeper: {
    two: 'contents of two.txt'
  },
  another: 'contents of another.txt'
}
```

### Options

`path`: the path to the base directory files should be loaded from

`includes`: an array of [minimatch](https://github.com/isaacs/minimatch) patterns that represent files that should be included. defaults to `['**/*']` (all files)

`excludes`: an array of minimatch patterns that should be ignored. defaults to `['node_modules/**', 'bower_components/**']`

`fn`: the function to run on each file the default fn is this:

```js
function (path) {
  return Fs.readFileSync(path, 'utf8');
}
```

this will load the files as plain utf8 text. you can pass any method that accepts a file path and returns a result. if you'd like to read a tree of javascript or json, set `fn` to `require`.
