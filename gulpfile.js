// Include gulp
var gulp = require('gulp'); 

// basePaths
var basePaths = {
  src: '_src/',
  dest: '_build/',
  partials: '_partials/',
  centurion: './node_modules/centurion-framework/lib/sass'
},
paths = {
  scripts: {
    src: basePaths.src + 'js/',
    dest: basePaths.dest + 'js/'
  },
  styles: {
    src: basePaths.src + 'sass/',
    dest: basePaths.dest + 'css/'
  },
  images: {
    src: basePaths.src + 'images/',
    dest: basePaths.dest + 'images/min/'
  }
};


// Include Our Plugins
var //jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    fileinclude = require('gulp-file-include')
    del = require('del');


// Clean Build
gulp.task('clean', function () {
  del([ basePaths.dest ]);
});


// Connect
gulp.task('connect', function() {
  connect.server({
    root: basePaths.dest,
    port: '5316',
    livereload: true
  });
});
 
gulp.task('html', function () {
  gulp.src('./'+basePaths.dest+'/*.html');
});


// HTML include
gulp.task('fileinclude', function() {
  gulp.src([ basePaths.src + '*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: basePaths.partials
    }))
    .pipe(gulp.dest( basePaths.dest ));
});


// Lint Task
/*
gulp.task('lint', function() {
  return gulp.src( paths.scripts.src + '*.js' )
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
*/

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src( paths.styles.src + '*.scss')
    .pipe(sourcemaps.init())
      //.pipe(sass())
      .pipe(sass({includePaths: [basePaths.centurion], errLogToConsole: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest( paths.styles.dest ));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src( paths.scripts.src + '*.js' )
    .pipe(concat( 'all.js' ))
    .pipe(gulp.dest( paths.scripts.dest ))
    .pipe(rename( 'all.min.js' ))
    .pipe(uglify())
    .pipe(gulp.dest( paths.scripts.dest ));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch( paths.scripts.src + '*.js', [/* 'lint', */ 'scripts']);
    gulp.watch( paths.styles.src + '*.scss', ['sass']);
    gulp.watch(['./'+basePaths.dest+'/*.html'], ['html']);
    gulp.watch( basePaths.src+'/*.html', ['fileinclude']);
});

// Default Task
gulp.task('default', [ 'clean', 'connect', /* 'lint', */ 'sass', 'scripts', 'fileinclude', 'watch' ]);