# howler.js + SVGアニメーションでオーディオビジュアライザーを作ってみるデモ
2021-07-21

- howler.jsで音源を再生
- howler.jsでWeb Audio APIのAudioContextを使って再生している音源の周波数を取得
- 毎フレームごとに取得した周波数をSVGのパスに適用してアニメーションさせる
- demo-4にてストリーミング音源にも対応

## 環境
- node v14.5.0（nodebrew使用）
- gulp 4.0.2
  - sassコンパイル
  - image 圧縮
  - svg 最適化
- webpack 4.42.2
  - js バンドル 圧縮 最適化
- babel 7.7.0
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

### gulp task
- `npx gulp` or `yarn gulp` gulp起動
