var gulp = require('gulp'),
    pkg = require('./package.json'),
    jekyll = require('gulp-jekyll-stream'),
    connect = require('gulp-connect'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version'),
    del = require('del');


// basePaths
var path = {
  src: 'source/',
  dest: 'dist/',
  centurion: './node_modules/centurion-framework/lib/sass'
},
paths = {
  scripts: {
    src: path.src + 'js/',
    dest: path.dest + 'js/'
  },
  styles: {
    src: path.src + 'sass/',
    dest: path.dest + 'css/'
  },
  images: {
    src: path.src + 'assets/',
    dest: path.dest + 'assets/min/'
  }
};

// Clean Build Folder
// ================================
gulp.task('clean', function () {
  del([ path.dest + '/**/*' ]);
});

// Connect
// ================================
gulp.task('connect', function() {
  connect.server({
    root: path.dest,
    port: '5316',
    livereload: true
  });
});

// Build Site using Jekyll
// https://www.npmjs.com/package/gulp-jekyll-stream/
// ================================
gulp.task('jekyll', function() {
  return gulp.src(process.cwd())
    .pipe(jekyll({
      bundleExec: true,
      quiet: true,
      safe: false,
      cwd: process.cwd(),
      layouts: '_layouts',
      plugins: '_plugins',
      source: path.src,
      destination: path.dest
    }));
});

// BUMP_VERSION
// https://www.npmjs.com/package/gulp-tag-version/
// ================================
/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type: importance}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit('bumps package version'))
        .pipe(filter('package.json'))
        // **tag it in the repository**
        //.pipe(tag_version());
};







// TASKS
// ================================
gulp.task('default', [ 'clean', 'jekyll', 'connect' ]);

// bump versions
gulp.task('patch', function() { return inc('patch'); })
gulp.task('feature', function() { return inc('minor'); })
gulp.task('release', function() { return inc('major'); })

// Things to Do:
// ===================================
// @TODO: [x] clean
// @TODO: [x] connect (server)
// @TODO: [x] jekyll

// @TODO: [] bump verion number

// @TODO: [] sass
// @TODO: [] include Centurion framework at core for usage
// @TODO: [] uncss
// @TODO: [] postcss
// @TODO: [] critical (create a critical CSS file)
// @TODO: [] add header to CSS files

// @TODO: [] uglify
// @TODO: [] concat
// @TODO: [] add header to JS files

// @TODO: [] imagemin
// @TODO: [] svgmin
// @TODO: [] responsive_images

// @TODO: [] HTML inject CSS and JS into templates

// @TODO: [] copy any other files

// @TODO: [] watch for changed files and run necessary processes
// @TODO: [] Livereload

// @TODO: [] CHANGELOG generate
// @TODO: [] gh-pages deploy
// @TODO: [] create ZIP file of version
