//Task:build:js
import gulp            from 'gulp';
import browserSync     from 'browser-sync';

gulp.task('reload:html', (done) => {
  browserSync.reload();
  done();
});
