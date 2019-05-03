const gulp = require('gulp'),
    pkg = require('./package.json'),
    fileinclude = require('gulp-file-include'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload')
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version'),
    ghpages = require('gulp-gh-pages'),
    del = require('del'),
    header = require('gulp-header'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    csswring = require('csswring'),
    include = require("gulp-include"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    tailwindcss = require("tailwindcss")
    ;

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

// basePaths
var paths = {
  source: 'source/',
  dest: 'dist/',
  sassPath: './node_modules/centurion-framework/lib/sass',
  bowerPath: './bower_components/'
};

// Clean Build Folder
// ================================
gulp.task('clean', function () {
  del([ paths.dest + '/**/*' ]);
});

// Build Site
// ================================
gulp.task('serve', function() {

  // connect to localhost
  connect.server({
    root: paths.dest,
    port: '5316',
    livereload: true
  });
  
});

gulp.task('fileinclude', function() {
  gulp.src([ paths.source + '**/*.html' ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(livereload())
    .pipe(gulp.dest('./dist/'));
});
gulp.task('html:watch', function () {
  livereload.listen();
  gulp.watch(paths.source + '**/*.html', ['fileinclude']);
});


// STYLES
// ================================
// SASS
gulp.task('sass', function () {
  gulp.src( paths.source + 'assets/sass/**/*.scss' )
    //.pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: paths.sassPath,
        errLogToConsole: true
    }))
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest( paths.dest + 'assets/css/' ));
});
// POSTCSS
gulp.task('postcss', function () {
  var processors = [
    autoprefixer({browsers: ['last 2 version']}),
    mqpacker,
    csswring
  ];
  return gulp.src(  paths.dest + 'assets/css/**/*.css' )
    .pipe(postcss(processors))
    .pipe(header(banner, { pkg : pkg } )) // add header to files
    .pipe(gulp.dest( paths.dest + 'assets/css/' ))
    .pipe(livereload());
});
// WATCH for STYLES
gulp.task('styles:watch', function () {
  livereload.listen();
  gulp.watch(paths.source + 'assets/sass/**/*.scss', ['sass']);
  gulp.watch(paths.dest + 'assets/css/**/*.css', ['postcss']);
});

// SCRIPTS
// ================================
// CONCAT
gulp.task('concat', function() {
  console.log("-- gulp is running task 'scripts'");

  gulp.src( paths.source + 'assets/**/*.js' )
    .pipe(include())
      .on('error', console.log)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(header(banner, { pkg : pkg } )) // add header to files
    .pipe(gulp.dest( paths.dest + 'assets/js' ))
    .pipe(livereload());
});
// WATCH for SCRIPTS
gulp.task('scripts:watch', function () {
  livereload.listen();
  gulp.watch(paths.source + 'assets/**/*.js', ['concat']);
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

// Deploy to Github Pages
// ================================
gulp.task('gh-pages', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghpages());
});


// TASKS
// ================================
gulp.task('watch', [ 'styles:watch', 'scripts:watch', 'html:watch' ]); //, 'images:watch'
gulp.task('styles', [ 'sass', 'postcss' ]);
gulp.task('scripts', [ 'concat' ]);
// gulp.task('images', [ 'responsive_images' ]);

// bump versions
gulp.task('patch', function() { return inc('patch'); })
gulp.task('feature', function() { return inc('minor'); })
gulp.task('release', function() { return inc('major'); })


gulp.task('default', [ 'clean', 'fileinclude', 'styles', 'scripts', 'serve', 'watch' ]);

