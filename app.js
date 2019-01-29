"use strct";

// Electron
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;


var http = require('http');
var fs = require('fs');
var url = require('url');

// Telloドローン IP,PORT
var PORT = 8889;
var HOST = '192.168.10.1';

var dgram = require('dgram');
var client = dgram.createSocket('udp4');

// Express
const express = require("express");
const exapp = express();
exapp.use(express.static(`views`));
exapp.listen(8002, "127.0.0.1");

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
    mainWindow.loadURL("http://127.0.0.1:8002");

    // イベント：ウィンドウクローズ時
    mainWindow.on("closed", () => {
        // 以下の処理実行時、イベント：全てのウィンドウが閉じた場合が実行されます
        mainWindow = null;
    });
});


/*** scratchデータの受取 **/
exapp.get('/telloControl/:vlue', function(req, response) {
    
    var pathname = url.parse(req.url).pathname;

    var url_params = req.url.split('/');

    if (url_params.length < 2)
		return;
		
	// リクエストのvalue値の取得
	var command = url_params[2];
	
	switch (command){
		
        case 'poll':
            respondToPoll(response);
            break;
		
        case 'takeoff':
			console.log('takeoff');
			TakeoffRequest();
		break;
		
        case 'land':
			console.log('land');
			LandRequest();
		break;
		
        case 'up':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('up ' + dis);
			var message = new Buffer( 'up '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});
		break;

        case 'down':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('down ' + dis);
			var message = new Buffer( 'down '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});			
		break;

        case 'left':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('left ' + dis);
			var message = new Buffer( 'left '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});
		break;

        case 'right':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('right ' + dis);
			var message = new Buffer( 'right '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});
		break;		
		
		case 'forward':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('forward ' + dis);
			var message = new Buffer( 'forward '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});			
		break;		
		
        case 'back':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('back ' + dis);
			var message = new Buffer( 'back '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});			
		break;

        case 'cw':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('cw ' + dis);
			var message = new Buffer( 'cw '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});
		break;

		case 'flip':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('flip' + dis);
			var message = new Buffer( 'flip '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});			
		break;	

		case 'ccw':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('ccw ' + dis);
			var message = new Buffer( 'ccw '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;	
			});
			client.on('message',function(msg,info){
				console.log('Data received from server : ' + msg.toString());
				console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
			});								
		break;		
		
		case 'setspeed':
			dis = (url_params.length >= 3) ? url_params[2] : 0;
			console.log('setspeed ' + dis);
			var message = new Buffer( 'speed '+ dis );
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
			});			
		break;
		
        /**** kintoneアクセス ****/
		case 'kintoneAddRecord':
			// 速度
			var message = new Buffer('speed?');
			let telloSpeed = "";
			client.send(message, 0, message.length, PORT, HOST, async function(err, bytes) {
				if (err) throw err;
				telloSpeed = await 6;

			});

			// バッテリー
			var message = new Buffer('battery?');
			let telloBattery = "";
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				telloBattery = 80;
			});

			// 飛行時間
			var message = new Buffer('time?');
			let flyTime = "";
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				flyTime = 60
			});
			
			// 高度
			var message = new Buffer('height?');
			let flyHeight = "";
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				flyHeight = 5;
			});

			// 気温
			var message = new Buffer('temp?');
			let temperature = "";
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				temperature = 12;
			});

			// TOFからの距離
			var message = new Buffer('tof?');
			let telloTof = "";
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				telloTof = 50;
			});

			// 加速度
			var message = new Buffer('acceleration?');
			let telloAcceleration = "";
			client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				telloAcceleration =  await 50;
			});

			console.log(telloSpeed)
			console.log(telloBattery)
			console.log(flyTime)
			console.log(flyHeight)
			console.log(temperature)
			console.log(telloTof)
			console.log(telloAcceleration)

            /** kintoneへアクセス **/
            // var entry_body = {
            //     'app': 350,
            //     'record':{
            //         'speed': {
            //             "value": telloSpeed
            //         },
            //         'battery': {
            //             "value": telloBattery
            //         },
            //         'fly_time': {
            //             "value": flyTime
            //         },
            //         'height': {
            //             "value": flyHeight
            //         },
            //         'temperature': {
            //             "value": temperature
            //         },
            //         'tof': {
            //             "value": telloTof
            //         },
            //         'acceleration': {
            //             "value": telloAcceleration
            //         }
            //     }
            // };

            // let params = {
            //     url:'https://ge-creative.cybozu.com/k/v1/record.json',
            //     method: 'POST',
            //     json: true,
            //     headers: {
            //         'X-Cybozu-API-Token': 'vCLeMxYChZoBHjai5eHyLPvtbTmjWcHGrXAH7KEm',
            //         'Content-Type': 'application/json',
            //     },
            //     body: entry_body
            // };

            // request(params, function(err, res, body) {
            //     if (err) {
            //     console.log(err);
            //     return;
            //     }
            //     console.log(body);
			// });
			
        break;
			
	}
    response.end('Hello Tello.\n');

});


function respondToPoll(response){

    var noDataReceived = false;

    var resp = "";
    var i;
    for (i = 0; i < dataToTrack_keys.length; i++){
        resp += dataToTrack_keys[i] + " ";
        resp += (i+10);
		resp += "\n";
    }
    response.end(resp);
}

function TakeoffRequest(){
	
	var message = new Buffer('command');

	client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
		if (err) throw err;
	});
	var message = new Buffer('takeoff');
	client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
		if (err) throw err;

	});
}

function LandRequest(){

	var message = new Buffer('land');

	client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
		if (err) throw err;
	});
}




// イベント：全てのウィンドウが閉じた場合
app.on("window-all-closed", () => {
    // macOS対応
    if (process.platform != "darwin") {
        // アプリ終了
        app.quit();
    }
});

module.exports = app;