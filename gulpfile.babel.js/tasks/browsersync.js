//Task:browser-sync
import {paths}     from '../config';
import gulp        from 'gulp';
import browserSync from 'browser-sync';

gulp.task('browsersync', () => {
  return browserSync.init({
    proxy        : paths.serverDir,
    open         : 'external'
  });
});