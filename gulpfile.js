const gulp = require('gulp');
const concat = require('gulp-concat');
const uglifycss = require('gulp-uglifycss');
const path = require('path');
const execSync = require('child_process').execSync;

const CSS_DIR = path.resolve('public', 'css');

gulp.task('compile', () => {
  execSync(`compass clean`, { cwd: __dirname });
  execSync(`compass compile`, { cwd: __dirname });
});

gulp.task('clean', () =>
    execSync(`rm -rf ${path.join(__dirname, 'public', 'css', 'style.min.css')}`));

gulp.task('compress:css', [ 'clean', 'compile' ], () =>
  gulp.src(path.join(CSS_DIR, '**/*.css'))
    .pipe(concat('style.min.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest(CSS_DIR)));
