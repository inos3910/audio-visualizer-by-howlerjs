//Task:Watch
import gulp from 'gulp'
import { globs } from '../config'

const watcher = done => {
  //sass
  gulp.watch(globs.sass, gulp.task('build:css'))
  //js
  gulp.watch(globs.js, gulp.task('build:js'))
  //html
  gulp.watch(globs.html, gulp.task('reload:html'))
  //TypeScript
  gulp.watch(globs.ts,   gulp.task('build:ts'))
  done()
}

gulp.task('watch', gulp.series(watcher, 'browsersync'))
