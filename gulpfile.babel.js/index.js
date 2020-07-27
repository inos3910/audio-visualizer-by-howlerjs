import gulp          from 'gulp';
import requireDir    from 'require-dir';
//Tasks
requireDir('./tasks', {recurse: true});
//Default
gulp.task('default', gulp.task('watch'));

//build
gulp.task('build', gulp.series(
  'delete:cssDir',
  'delete:jsDistDir',
  'build:css',
  'build:js-all'
  )
);
//TypeScript
gulp.task('build-ts', gulp.series(
  'clean:ts',
  'build:ts'
  )
);