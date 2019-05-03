// Require
const { src, dest, parallel, task } = require('gulp');
const paths = require("../../package.json").paths;
const browserSync = require('browser-sync').create();


// Reload Task
function reload(done) {
  browserSync.reload();
  done();
}

// Serve Task
function serve(done) {
  browserSync.init({
    server: {
      baseDir: paths.dist.base
    }
  });
  done();
}


// Export Tasks
task('reload', reload)
task('serve', serve)
