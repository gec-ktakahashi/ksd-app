"use strct";

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

const request = require('request');


// イベント：起動時
app.on("ready", () => {
    // ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        useContentSize: true
    });
    // 使用するhtmlファイルを指定する
    mainWindow.loadURL(`file://${__dirname}/views/index.html`);

    // 開発者ツールを表示する
    mainWindow.webContents.openDevTools();

    // ローカルホストを画面描画
    mainWindow.loadURL("http://127.0.0.1:3939");

    // イベント：ウィンドウクローズ時
    mainWindow.on("closed", () => {
        // 以下の処理実行時、イベント：全てのウィンドウが閉じた場合が実行されます
        mainWindow = null;
    });
});


/*** scratchデータの受取 **/
exapp.get('/test/:volume/:id/:number',(req, res) => {
    console.log(req.params)
    /** scratchデータの取得 **/
    var volume = req.params.volume;
    var id = req.params.id;
    var number = req.params.number;

    /** kintoneへアクセス **/
    var entry_body = {
        'app': 350,
        'record':{
            'test_one':{
                "value": volume
            },
            'test_two': {
                "value": id
            },
            'test_three': {
                "value": number
            }
        }
    };

    let params = {
        url:'https://ge-creative.cybozu.com/k/v1/record.json',
        method: 'POST',
        json: true,
        headers: {
            'X-Cybozu-API-Token': 'vCLeMxYChZoBHjai5eHyLPvtbTmjWcHGrXAH7KEm',
            'Content-Type': 'application/json',
        },
        body: entry_body
    };

    request(params, function(err, resp, body) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(body);
    });

    res.send("OK");
});




// イベント：全てのウィンドウが閉じた場合
app.on("window-all-closed", () => {
    // macOS対応
    if (process.platform != "darwin") {
        // アプリ終了
        app.quit();
    }
});

module.exports = app;