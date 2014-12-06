var gulp          = require('gulp'),
    uglify        = require('gulp-uglify'),
    jshint        = require('gulp-jshint'),
    concat        = require('gulp-concat'),
    streamqueue   = require('streamqueue');

gulp.task( 'build', ['scripts'] );

gulp.task('watch', function () {
  gulp.watch('public/assets/javascripts/**/*.js', ['build']);
});

gulp.task( 'scripts', function () {
  return streamqueue( { objectMode: true },
    gulp.src('public/assets/javascripts/partials/_facebook-authentication.js'),
    gulp.src('public/assets/javascripts/partials/_parse-analytics.js'),
    gulp.src('public/assets/javascripts/partials/user/_create.js'),
    gulp.src('public/assets/javascripts/partials/user/_login.js'),
    gulp.src('public/assets/javascripts/partials/match/_create.js'),
    gulp.src('public/assets/javascripts/main.js')
  )
  .pipe( jshint() )
  .pipe( jshint.reporter('default') )
  .pipe( uglify() )
  .pipe( concat('assets/javascripts/main-min.js') )
  .pipe( gulp.dest('build') );
} );

gulp.task('default', ['watch']);
