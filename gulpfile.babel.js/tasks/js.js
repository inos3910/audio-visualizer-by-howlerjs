//Task:build:js
import gulp            from 'gulp';
import {globs, paths}  from '../config';
//エラーでgulpが終了するのを止める
import plumber         from 'gulp-plumber';
//デスクトップ通知
import notify          from 'gulp-notify';
import path            from 'path';
import fs              from 'fs';
import through         from 'through2';
import vinyl           from 'vinyl';
import diff            from 'gulp-diff-build';
import cache           from 'gulp-cached';
//webpackでファイル結合時に名前変更
import named           from 'vinyl-named';
import gulpif          from 'gulp-if';
import webpack         from 'webpack';
import webpackStream   from 'webpack-stream';
import webpackConfig   from '../webpack.config';
import browserSync     from 'browser-sync';
//ファイル削除
import del                      from 'del'

//出力済みファイルを削除
gulp.task('delete:jsDistDir', (cb) => {
  return del([paths.jsDistDir], cb);
});

//処理中のファイル名を入れる
let proccessings = [];

//jsのエントリーポイントファイルかどうか
const isEntryFile = (file) => {
  let isEf = true;
  if(!isExistFile(file.path)){
    isEf = false;
  }
  else {
    isEf = path.basename(file.path) === paths.jsEntryFileName;
  }
  return isEf;
}

//ファイルの存在チェック
function isExistFile(file) {
  try {
    fs.statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}

//バンドル実行中のファイルかどうか
function isProccessing (filePath) {
  return (proccessings.indexOf(filePath) >= 0);
}

//entryファイルのみを次の処理に通す
function passThroughEntry() {
  return through.obj(function (file, enc, cb) {
    if( file.isNull() ){
      cb(null,file);
    }
    else {
      //同じ階層のentryファイルを返す
      const relative = path.parse(file.relative).dir;
      const entryPath = `${file.base}${relative}/${paths.jsEntryFileName}`;
      if(isExistFile(entryPath)){
        //バイナリファイルを生成
        const data = fs.readFileSync(entryPath, 'utf8');
        const f = new vinyl({
          cwd      : file.cwd,
          base     : file.base,
          path     : entryPath,
          contents : new Buffer(data)
        });
        //処理中のファイルは回避
        if(!isProccessing(entryPath)){
          proccessings.push(entryPath);
          this.push(f);
        }
        cb();
        return;
      }
      cb();
    }
  });
}

//bundleされたファイルのみを次の処理に通す
function passThroughBundled() {
  proccessings = [];
  return through.obj(function (file, enc, cb) {
    if( file.isNull() ){
      cb(null,file);
    }
    else {
      const basename = path.basename(file.path);
      const isBundled = basename.indexOf('bundle.js') !== -1;
      if(isBundled){
        this.push(file);
      }
      cb();
    }
  });
}


gulp.task('build:js', () => {
  return gulp.src(globs.js, { allowEmpty: true })
  .pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  }))
  .pipe(diff())
  // .pipe(cache('js'))
  // .pipe(passThroughEntry())
  .pipe(named((file) => {
    return file.relative ? path.parse(file.relative).dir : 'code';
  }))
  .pipe(
    gulpif(isEntryFile, webpackStream(webpackConfig, webpack))
    )
  .pipe(passThroughBundled())
  .pipe(gulp.dest(paths.jsDistDir))
  .pipe(notify('js-build finished'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('build:js-all', () => {
  return gulp.src(globs.entry, { allowEmpty: true })
  .pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  }))
  .pipe(named((file) => {
    return file.relative ? path.parse(file.relative).dir : 'code';
  }))
  .pipe(
    gulpif(isEntryFile, webpackStream(webpackConfig, webpack))
    )
  .pipe(gulp.dest(paths.jsDistDir))
  .pipe(notify('build:js-all finished'))
  .pipe(browserSync.reload({
    stream: true
  }));
});