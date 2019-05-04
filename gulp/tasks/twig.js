// Require
const gulp = require('gulp');
const { src, dest, parallel, task } = require('gulp');
const paths = require("../../package.json").paths;
const twig = require('gulp-twig');
const data = require('gulp-data');
const fm = require('front-matter');


// Task Function
function templates() {
  return src(paths.src.templates + '*.html')
        .pipe(data(function(file) {
          var content = fm(String(file.contents));
          file.contents = new Buffer.from(content.body);
          return content.attributes;
        }))
        .pipe(twig())
        .pipe(dest(paths.dist.base));
}


// Export Task
task('templates', templates);