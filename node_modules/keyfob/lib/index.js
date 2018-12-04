'use strict';

const Fs = require('fs');
const Minimatch = require('minimatch').Minimatch;
const Path = require('path');

const internals = {};
internals.matches = function (patterns, file) {

  return patterns.some((pattern) => {

    return pattern.match(file);
  });
};

internals.readDir = function (path, options) {

  const entries = Fs.readdirSync(path);
  const result = {};

  for (const entry of entries) {
    const name = Path.basename(entry, Path.extname(entry));
    const fullPath = Path.join(path, entry);
    const stat = Fs.statSync(fullPath);
    const relativePath = Path.relative(options.root, fullPath);

    if (stat.isDirectory() &&
        !internals.matches(options.excludes, relativePath)) {

      result[name] = internals.readDir(Path.join(path, entry), options);
    }

    if (stat.isFile() &&
        !internals.matches(options.excludes, relativePath) &&
        internals.matches(options.includes, relativePath)) {

      result[name] = options.fn(Path.join(path, entry));
    }
  }

  return result;
};

exports.load = function (opts) {

  const defaults = {
    path: process.cwd(),
    includes: ['**/*'],
    excludes: ['node_modules/**', 'bower_components/**'],
    fn: function (path) {

      return Fs.readFileSync(path, 'utf8');
    }
  };

  const options = Object.assign({}, defaults, opts);
  options.includes = options.includes.map((pattern) => new Minimatch(pattern));
  options.excludes = options.excludes.map((pattern) => new Minimatch(pattern));

  options.root = Path.resolve(options.path);
  const result = internals.readDir(options.root, options);

  return result;
};
