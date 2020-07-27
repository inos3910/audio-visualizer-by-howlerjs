//Task:css
import gulp                     from 'gulp'
import sass                     from 'gulp-sass'
import nodesass                 from 'node-sass'
sass.compiler = nodesass;
//エラーでgulpが終了するのを止める
import plumber                  from 'gulp-plumber'
//デスクトップ通知
import notify                   from 'gulp-notify'
//小さい画像をbase64に変換
import base64                   from 'gulp-base64'
//PostCss
import postcss                  from 'gulp-postcss'
import cssnext                  from 'postcss-cssnext'
import cssImport                from 'postcss-import'
//flexboxのバグを自動修正
import flexBugsFixes            from 'postcss-flexbugs-fixes'
//ファイル名から画像パスやサイズを取得
import assets                   from 'postcss-assets'
//メディアクエリを整理する
import mqpacker                 from 'css-mqpacker'
//cssを圧縮する
import csso                     from 'gulp-csso'
//ソースマップの生成
import sourcemaps               from 'gulp-sourcemaps'
//config
import {paths, globs, browsers} from '../config'
import diff                     from 'gulp-diff-build'
import cache                    from 'gulp-cached'
import progeny                  from 'gulp-progeny'
import browserSync              from 'browser-sync'
//@importのglobを有効にする
import sassGlob                 from 'gulp-sass-glob'
//ファイル削除
import del                      from 'del'

//出力済みファイルを削除
gulp.task('delete:cssDir', (cb) => {
  return del([paths.cssDir], cb);
});

gulp.task('build:css', () => {
  const processors = [
  assets({
    baseUrl     : `${paths.serverDir}/`,
    basePath    : paths.themeDir,
    loadPaths   : [
    'assets/images/',
    'assets/svg/',
    ],
    relative    : true,
    cachebuster : true,
  }),
  cssnext({
    browsers,
    features : {
      autoprefixer : {
        grid: true
      }
    }
  }),
  mqpacker({
    sort: true
  }),
  flexBugsFixes,
  cssImport({
    path: [ 'node_modules' ]
  })
  ];
  return gulp.src(globs.sass, { allowEmpty: true })
  .pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  }))
  .pipe(sassGlob())
  .pipe(diff())
  .pipe(cache('sass'))
  .pipe(progeny())
  .pipe(sass({
    outputStyle: 'expanded',
  }))
  .pipe(base64({
    baseDir      : paths.imageDir,
    extensions   : ['svg', 'png', /\.jpg#datauri$/i],
    exclude      : [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
    maxImageSize : 8 * 1024,
    debug        : true
  }))
  .pipe(postcss(processors))
  .pipe(sourcemaps.init())
  .pipe(csso({
    restructure : false,
    sourceMap   : false,
    debug       : true
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.cssDir))
  .pipe(notify('css-build finished'))
  .pipe(browserSync.reload({
    stream: true
  }));
});