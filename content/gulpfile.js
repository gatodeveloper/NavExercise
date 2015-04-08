var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var header = require('gulp-header');
var size = require('gulp-size');
var connect = require('gulp-connect');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');


var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');
var onError = function (err) {
  gutil.beep();
  console.log(err);
  console.log('*****MESSAGE*****');
  console.log(err.message);
};
var paths = {
  index: './index.html',
  scripts: ['./js/app/*.js', './js/app/**/*.js'],
  sass: ['./css/sass/*.sass', './css/sass/**/*.sass'],
  images: './img/**/*',
  fonts: './fonts/**/*'

};

/**
 * Update index.html
 */

gulp.task('html:index', function () {
  gulp.src(paths.index)
    .pipe(connect.reload())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulp.dest('../public/'))
});

/**
 * Concat app scripts
 */
gulp.task('scripts', function () {
  gulp.src(paths.scripts)
    .pipe(connect.reload())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(concat('main.js'))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(size({title: 'main.js'}))
    .pipe(gulp.dest('../public/js/dist/'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(size({title: 'main.min.js'}))
    .pipe(gulp.dest('../public/js/dist/'))
});

/**
 * Compile SASS files
 */
gulp.task('sass', function () {
  gulp.src(paths.sass)
    .pipe(connect.reload())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass({
      quiet: true,
      lineNumbers: true,
      bundleExec: false,
      //loadPath: require('node-neat').includePaths
    }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(size({title: 'main.css'}))
    .pipe(gulp.dest('../public/styles/'))
    .pipe(rename('main.min.css'))
    .pipe(minifyCSS())
    .pipe(size({title: 'main.min.css'}))
    .pipe(gulp.dest('../public/styles/'))
});


/**
 * Minify images
 */
gulp.task('images', function(){
  gulp.src(paths.images)
    //.pipe(imagemin())
    .pipe(gulp.dest('../public/images/'));
});
gulp.task('fonts', function(){
  gulp.src(paths.fonts)
    //.pipe(imagemin())
    .pipe(gulp.dest('../public/fonts/'));
});

/**
 *Watch files
 */
gulp.task('watch:html', function () {
  gulp.watch(paths.index, ['html:index']);
});
gulp.task('watch:scripts', function () {
  gulp.watch(paths.scripts, ['scripts']);
});
gulp.task('watch:sass', function () {
  gulp.watch(paths.sass, ['sass']);
});
gulp.task('watch:dev', ['watch:html', 'watch:scripts', 'watch:sass']);



/**
 * Default task
 */
gulp.task('buildAssets', ['html:index', 'scripts', 'sass', 'images', 'fonts']);
gulp.task('default', ['buildAssets', 'watch:dev']);