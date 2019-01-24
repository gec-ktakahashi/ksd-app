"use strct";

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var express = express();

express.use('/', indexRouter);

// Electron
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;


// Express
const express = require("express");
const exapp = express();
exapp.use(express.static(`views`));
exapp.listen(3939, "127.0.0.1");


// イベント：起動時
app.on("ready", () => {
    // ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        useContentSize: true
    });
    // 使用するhtmlファイルを指定する
    // mainWindow.loadURL(`file://${__dirname}/views/index.html`);

    // 開発者ツールを表示する
    mainWindow.webContents.openDevTools();

    // ローカルホストを画面描画
    mainWindow.loadURL("http://127.0.0.1:3939/");

    // イベント：ウィンドウクローズ時
    mainWindow.on("closed", () => {
        // 以下の処理実行時、イベント：全てのウィンドウが閉じた場合が実行されます
        mainWindow = null;
    });
});

// イベント：全てのウィンドウが閉じた場合
app.on("window-all-closed", () => {
    // macOS対応
    if (process.platform != "darwin") {
        // アプリ終了
        app.quit();
    }
});