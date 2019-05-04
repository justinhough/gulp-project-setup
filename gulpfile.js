'use strict';

const { src, dest, task, parallel, registry, series, watch } = require('gulp');
const HubRegistry = require('gulp-hub');
const log = require('fancy-log');
const del = require('del');
const paths = require("./package.json").paths;

const clean = () => del(['dist']);

// load some files into the registry
const hub = new HubRegistry(['./gulp/tasks/*.js']);

// tell gulp to use the tasks just loaded
registry(hub);

// Define Watcher
const watcher = () => watch([paths.src.css, paths.src.templates], series('styles', 'templates', 'reload'));

// Define Combined Tasks
const build = series(clean, 'styles', 'templates', 'serve', watcher);

// Default Task
task('default', parallel(build));
