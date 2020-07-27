# gulp.js 仕様

## 概要

* `Sass` をコンパイルして `CSS` を出力
* `JS` をコンパイル・結合して出力
* 画像を圧縮
* `SVG` を圧縮
* ファイルの変更があった場合はオートリロードするなどの機能 ( `BrowserSync` )

---

## ファイル構成

### index.js

### config.js

### webpack.config.js

### /tasks

* `browsersync.js`
* `css.js`
* `img.js`
* `js.js`
* `svg.js`
* `watch.js`

---

## 詳細

### index.js

* メインファイル
* 各タスクの呼び出し
* `default` ( `gulp` と叩いて実行されるタスク ) の設定

| 使用モジュール | 機能                                    |
| :------------- | :-------------------------------------- |
| `require-dir`  | ディレクトリ内のファイルを`require`する |

### config.js

* パスやクロスブラウザの設定

| 使用モジュール | 機能                   |
| :------------- | :--------------------- |
| `path`         | Node.js パスモジュール |

### webpack.config.js

`webpack`の設定

| 使用モジュール            | 機能                 |
| :------------------------ | :------------------- |
| `webpack`                 | webpack              |
| `uglifyjs-webpack-plugin` | JS の圧縮            |
| `webpack-encoding-plugin` | 文字エンコーディング |

`plugin`の設定

| 使用プラグイン            | 機能                                                               |
| :------------------------ | :----------------------------------------------------------------- |
| `UglifyJSPlugin`          | JS 圧縮                                                            |
| `OccurrenceOrderPlugin`   | ファイルサイズの縮小効果                                           |
| `AggressiveMergingPlugin` | 共通化できそうな箇所はまとめてより積極的にコードを圧縮する         |
| `EncodingPlugin`          | UTF-8 を強制する                                                   |
| `ProvidePlugin`           | `import`を書かずにバンドルに含めるライブラリやモジュールを設定する |

`babel`の設定

* `babel-loader`で`babel-preset-env` を設定
* `transform-runtime`で `polyfill`を bundle ファイルに含める

`alias`の設定

* `node_modules`ディレクトリを解決
* `@js`を js フォルダのエイリアスとして使う

### /tasks

#### browsersync.js

Browsersync の設定

| 使用モジュール | 機能        |
| :------------- | :---------- |
| `browser-sync` | BrowserSync |

#### css.js

Sass のコンパイル

| 使用モジュール    | 機能                                                     |
| :---------------- | :------------------------------------------------------- |
| `gulp-sass`       | sass のコンパイル                                        |
| `gulp-plumber`    | エラー時に gulp を終了させない                           |
| `gulp-notify`     | デスクトップ通知                                         |
| `gulp-base64`     | 小さい画像を base64 に変換                               |
| `gulp-postcss`    | PostCSS を使用                                           |
| `postcss-cssnext` | CSS の先行実装を現在のブラウザが解釈できる構文に変換する |
| `css-mqpacker`    | メディアクエリを整理する（PostCSS 依存）                 |
| `gulp-csso`       | css を圧縮する                                           |
| `gulp-sourcemaps` | ソースマップの生成                                       |
| `gulp-diff-build` | ファイルに変更があった場合に処理する                     |
| `gulp-cached`     | キャッシュ機能                                           |
| `gulp-progeny`    | Sass の`@import`構文を解決する                           |
| `browser-sync`    | BrowserSync                                              |

#### img.js

画像の最適化

| 使用モジュール      | 機能                           |
| :------------------ | :----------------------------- |
| `gulp-changed`      | ファイルの変更を検知           |
| `gulp-plumber`      | エラー時に gulp を終了させない |
| `gulp-imagemin`     | 画像最適化                     |
| `imagemin-pngquant` | PNG 画像最適化                 |
| `imagemin-mozjpeg`  | JPEG 画像最適化                |

#### js.js

JS のコンパイル・結合

| 使用モジュール    | 機能                                           |
| :---------------- | :--------------------------------------------- |
| `gulp-plumber`    | エラー時に gulp を終了させない                 |
| `gulp-notify`     | デスクトップ通知                               |
| `path`            | Node.js パスモジュール                         |
| `fs`              | Node.js ファイルシステム API                   |
| `through2`        | 自作プラグイン処理用 Stream.Transform ラッパー |
| `vinyl`           | バイナリファイル API                           |
| `gulp-diff-build` | ファイルに変更があった場合に処理する           |
| `gulp-cached`     | キャッシュ機能                                 |
| `vinyl-named`     | Webpack の出力ファイル名に使う[name]を変更     |
| `gulp-if`         | pipe に if 文を使用できる                      |
| `webpack`         | webpack                                        |
| `webpack-stream`  | Webpack を gulp で使う                         |
| `browser-sync`    | BrowserSync                                    |

#### svg.js

SVG の最適化

| 使用モジュール | 機能                 |
| :------------- | :------------------- |
| `gulp-changed` | ファイルの変更を検知 |
| `gulp-svgmin`  | SVG の最適化         |

#### watch.js

監視するファイルとその処理

| 使用モジュール | 機能                        |
| :------------- | :-------------------------- |
| `gulp-watch`   | 追加ファイルを watch させる |
