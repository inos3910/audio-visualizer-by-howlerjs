//Task:imagemin
import gulp from 'gulp';
import { globs, paths } from '../config.js';
//エラーでgulpが終了するのを止める
import plumber from 'gulp-plumber';
//画像圧縮
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import mozjpeg from 'imagemin-mozjpeg';
//CSSスプライト
import spritesmith from 'gulp.spritesmith';
//webp生成
import webp from 'gulp-webp';
import rename from 'gulp-rename';

gulp.task('imagemin', () => {
  return gulp.src(globs.img, {
    allowEmpty : true,
    since      : gulp.lastRun('imagemin')
  })
  .pipe(plumber())
  .pipe(
    imagemin([
      pngquant({
        quality: [.8, .9],
        speed: 1,
        floyd: 0
      }),
      mozjpeg({
        quality: 85,
        progressive: true
      }),
      imagemin.svgo(),
      imagemin.optipng(),
      imagemin.gifsicle()
      ])
    )
  .pipe(imagemin())
  .pipe(gulp.dest(paths.imageminDir));
});

//WebPへ変換
gulp.task('webp', () => {
  let extension;
  const arr = {};
  return gulp
  .src(globs.img)
  .pipe(
    rename(path => {
      arr[`${path.dirname}${path.basename}`] = path.extname;
    })
    )
  .pipe(webp())
  .pipe(
    rename(path => {
      if (path.extname === '.webp') {
        path.basename += arr[`${path.dirname}${path.basename}`];
      }
    })
    )
  .pipe(gulp.dest(paths.imageDir));
});

//CSSスプライト画像の生成
gulp.task('sprite', () => {
  const spriteData = gulp.src(globs.sprite, { allowEmpty: true })
  .pipe(
    spritesmith({
      imgName: 'dest/sprite.png',
      cssName: '_sprite.scss',
      imgPath: `../sprite/dest/sprite.png`,
      cssFormat: 'scss',
      cssVarMap: sprite => {
        sprite.name = 'sprite-' + sprite.name;
      }
    })
    );
  spriteData.img.pipe(gulp.dest(paths.spriteDir));
  return spriteData.css.pipe(gulp.dest(`${paths.sassDir}/foundation`));
});

//スプライト画像の圧縮
gulp.task('spritemin', () => {
  return gulp
  .src(globs.sprites,{
    allowEmpty : true,
    since      : gulp.lastRun('spritemin')
  })
  .pipe(plumber())
  .pipe(
    imagemin([
      pngquant({
        quality: [.8, .9],
        speed: 1,
        floyd: 0
      }),
      mozjpeg({
        quality: 90,
        progressive: true
      }),
      imagemin.optipng()
      ])
    )
  .pipe(gulp.dest(paths.spriteminDir));
});
