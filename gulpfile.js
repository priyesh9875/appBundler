var gulp = require('gulp');
var webpack = require('webpack-stream');
var express = require('express');
var path = require('path');
var gulpSequence = require('gulp-sequence');
var rename = require('gulp-rename');

// Webpack
gulp.task('webpack', function () {


  gulp.src('./src/app/app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./src/static/'));

});


// Watch
gulp.task('watch', function () {
  gulp.watch('./src/app/**/*', ['webpack'])
})

gulp.task('default', gulpSequence('webpack', 'watch'));
