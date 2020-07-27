# howler.js + SVGアニメーションでオーディオビジュアライザーを作ってみるデモ
2020-07-27 12:12:02

- howler.jsで音源を再生
- howler.jsでWeb Audio APIのAudioContextを使って再生している音源の周波数を取得
- 毎フレームごとに取得した周波数をSVGのパスに適用してアニメーションさせる

## 環境
- node v14.5.0（nodebrew使用）
- gulp 4.x
  - sassコンパイル
  - image 圧縮
  - svg 最適化
- webpack 4.x
  - js バンドル 圧縮 最適化
- babel 7.x
  - js es6最適化
- browserSync
  - ライブリロード

## メモ
- タスクランナーはテーマに設置してあるのでテーマディレクトリで起動する
- `sudo yarn` or `npm install`で環境作成
- node_modulesがpermission errorの場合は `sudo chmod 777 [node_modulesのパス]`で権限を変更すればOK

### npm scripts
- `npm run dev` or `yarn dev` 開発モード
- `npm run build` or `yarn build` 本番モードでビルド
- `npm run imagemin` or `yarn imagemin` 画像圧縮
- `npm run sprite` or `yarn sprite` スプライト画像の生成
- `npm run spritemin` or `yarn spritemin`スプライト画像の圧縮

### gulp タスク
- `npx gulp` or `yarn gulp` gulp起動
- `npx gulp imagemin` or `yarn gulp imagemin` 画像圧縮
- `npx gulp sprite` or `yarn gulp  sprite` スプライト画像の生成
- `npx gulp spritemin` or `yarngulp  spritemin` スプライト画像の圧縮
