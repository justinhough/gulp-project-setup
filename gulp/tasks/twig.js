// Require
const gulp = require('gulp');
const { src, dest, parallel, task } = require('gulp');
const paths = require("../../package.json").paths;
const twig = require('gulp-twig');


// Task Function
function templates() {
  return src(paths.html.templates + '*.html')
        .pipe(twig())
        .pipe(dest(paths.dist.base));
}


// Export Task
task('templates', templates);