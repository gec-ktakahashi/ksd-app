"use strct";

// Electron
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

// http
const http = require('http');
// const kintoneRequest = require('request');
const fs = require('fs');
const url = require('url');

const dgram = require('dgram');
const client = dgram.createSocket('udp4');


// Telloドローン IP,PORT
let PORT = 8889;
let HOST = '192.168.10.1';


// イベント：起動時
app.on("ready", () => {
	// ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
	mainWindow = new BrowserWindow({
		width: 300,
		height: 300,
		useContentSize: true
	});

	// 使用するhtmlファイルを指定する
	mainWindow.loadURL(`file://${__dirname}/views/index.html`);

	// 開発者ツールを表示する
	mainWindow.webContents.openDevTools();

	// イベント：ウィンドウクローズ時
	mainWindow.on("closed", () => {
		// 以下の処理実行時、イベント：全てのウィンドウが閉じた場合が実行されます
		mainWindow = null;
	});


	http.createServer(function (request, response) {

		var pathname = url.parse(request.url).pathname;

		var url_params = request.url.split('/');

		if (url_params.length < 2)
			return;

		var command = url_params[1];

		switch (command) {


			case 'command':
				var message = new Buffer('command');
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});

				break;


			/**** 離陸 ****/
			case 'takeoff':
				console.log('takeoff');
				TakeoffRequest();
				break;


			/**** 着陸 ****/
			case 'land':
				console.log('land');
				LandRequest();
				break;


			/**** kintoneデータ登録 ****/
			case 'kintone':
				console.log('kintone')

				/** 速度 **/
				var message_speed = new Buffer('speed?');
				client.send(message_speed, 0, message_speed.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});

				/** バッテリー **/
				var message_battery = new Buffer('battery?');
				client.send(message_battery, 0, message_battery.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});

				/** 飛行時間 **/
				var message_time = new Buffer('time?');
				client.send(message_time, 0, message_time.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});

				/** 高度 **/
				var message = new Buffer('height?');
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});

				/** 温度 **/
				var message = new Buffer('temp?');
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				
				
				/** Telloからのレスポンス取得 **/
				var resp = [];
				client.on('message', (msg, info) => {
					console.log('succese')

					var telloData = msg.toString();
					var int = parseInt(telloData)
					resp.push(int)

					if(resp.length == 6) {
						/** 配列の取得 **/
						var telloSpeed = resp[0]
						var telloBattery = resp[1]
						var telloFlytime = resp[2]
						var telloHeight = resp[3]
						var telloTemperature = resp[4]

						/** kintoneへアクセス **/
						var entry_body = {
							'app': 350,
							'record': {
								'speed': {
									"value": telloSpeed
								},
								'battery': {
									"value": telloBattery
								},
								'fly_time': {
									"value": telloFlytime
								},
								'height': {
									"value": telloHeight
								},
								'temperature': {
									"value": telloTemperature
								}
							}
						};

						let params = {
							url: 'https://ge-creative.cybozu.com/k/v1/record.json',
							method: 'POST',
							json: true,
							headers: {
								'X-Cybozu-API-Token': 'vCLeMxYChZoBHjai5eHyLPvtbTmjWcHGrXAH7KEm',
								'Content-Type': 'application/json',
							},
							body: entry_body
						};
						kintoneRequest(params, function (err, res, body) {
							if (err) {
								console.log(err);
								return;
							}
							console.log(body);
						});
					}
				});
				break;


			/**** 上昇 ****/
			case 'up':
				console.log('up')
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('up ' + dis);
				var message = new Buffer('up ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;


			/**** 下降 ****/
			case 'down':
				console.log('down')
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('down ' + dis);
				var message = new Buffer('down ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;


			/**** 左移動 ****/
			case 'left':
				console.log('left')

				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('left ' + dis);
				var message = new Buffer('left ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;


			/**** 右移動 ****/
			case 'right':
				console.log('right')

				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('right ' + dis);
				var message = new Buffer('right ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;


			/**** 前進 ****/
			case 'forward':
				console.log('forward')

				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('forward ' + dis);
				var message = new Buffer('forward ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;


			/**** 後進 ****/
			case 'back':
				console.log('back')

				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('back ' + dis);
				var message = new Buffer('back ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;


			/**** 右回転 ****/
			case 'cw':
				console.log('cw')

				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('cw ' + dis);
				var message = new Buffer('cw ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;


			/**** 左回転 ****/
			case 'ccw':
				console.log('ccw')

				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('ccw ' + dis);
				var message = new Buffer('ccw ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				client.on('message', function (msg, info) {
					console.log('Data received from server : ' + msg.toString());
					console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
				});
				break;


			/**** フリップ ****/
			case 'flip':
				console.log('flip')

				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('flip' + dis);
				var message = new Buffer('flip ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;


			/**** スピード変更 ****/
			case 'setspeed':
				console.log('setspeed')

				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('setspeed ' + dis);
				var message = new Buffer('speed ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;
		}
		response.end('Hello Tello.\n');

	}).listen(8001);

	console.log('---------------------------------------');
	console.log('Tello Scratch Ext running at http://127.0.0.1:8001/');
	console.log('---------------------------------------');
});


/***** 離陸 *****/
function TakeoffRequest() {

	var message = new Buffer('command');
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
	});

	var message = new Buffer('takeoff');
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;

	});
}


/***** 着陸 *****/
function LandRequest() {
	var message = new Buffer('land');

	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
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