# kintone x SCRATCH x ドローン 連携アプリ

kintone-hive 講演 デモ用

## Description

- [kintone](https://kintone.cybozu.co.jp/)
- [SCRATCH v2.0](https://scratch.mit.edu/download/scratch2)
- ドローン（未定）

SCRATCH でドローンを操作し、ドローンの出力をこのアプリで受け取り、kintone に送信します。  
ドローンはローカルホストにしか送信出来ないため、経由ホストとして Electron でローカルホストサーバを立てて、kintone に値を送信する形式となります。

## Requirement

- [Node.js](https://nodejs.org/ja/)
- [npm](https://www.npmjs.com/)

## Develop

```bash
$ npm i -g yarn
$ cd scratch-drone-app
$ yarn install
$ yarn dev
```

## Production

```bash
$ yarn build
```
