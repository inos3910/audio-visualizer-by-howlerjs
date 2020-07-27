//Task:build:js
import gulp            from 'gulp';
import {globs, paths}  from '../config';
//エラーでgulpが終了するのを止める
import plumber         from 'gulp-plumber';
//デスクトップ通知
import notify          from 'gulp-notify';
import diff            from 'gulp-diff-build';
import cache           from 'gulp-cached';
//webpackでファイル結合時に名前変更
import named           from 'vinyl-named';
import gulpif          from 'gulp-if';
import webpack         from 'webpack';
import webpackStream   from 'webpack-stream';
import webpackConfig   from '../webpack.config';
import browserSync     from 'browser-sync';
import del             from 'del';
import path            from 'path';

gulp.task('clean:ts', (done) => {
  del([paths.tsDistDir]);
  done();
});

gulp.task('build:ts', () => {
  return gulp.src(globs.ts, { allowEmpty: true })
  .pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  }))
  .pipe(diff())
  .pipe(cache('ts'))
  .pipe(named((file) => {
    return path.parse(file.relative).dir ? path.parse(file.relative).dir : 'main';
  }))
  .pipe(webpackStream(webpackConfig, webpack))
  .on('error', function(error) {
    this.emit('end');
  })
  .pipe(gulp.dest(paths.tsDistDir))
  .pipe(notify('build:ts finished'))
  .pipe(browserSync.reload({
    stream: true
  }));
});