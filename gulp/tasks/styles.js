// Require
const { src, dest, task } = require('gulp');
const paths = require("../../package.json").paths;
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');


// Custom extractor for Tailwind
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g) || [];
  }
}


// Styles Task
function styles() {
  return src(paths.src.css + '*.css')
        .pipe(
          postcss([tailwindcss(paths.config.tailwind), require("autoprefixer")])
        )
        .pipe(dest(paths.dist.css))
        .pipe(browserSync.reload({
            stream: true
        }))
}


// Export Tasks
task('styles', styles)