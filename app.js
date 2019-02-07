"use strct";

/***** インポート *****/

const electron = require("electron");
const http = require('http');
const request_module = require('request');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');


/***** グローバル変数／定数 *****/

// Electronアプリインスタンス
const app = electron.app;
// Electronブラウザインスタンス
const BrowserWindow = electron.BrowserWindow;
// メインウィンドウのインスタンス格納用変数
let mainWindow = null;

// Telloドローン IP,PORT
const PORT = 8889;
const HOST = '192.168.10.1';

// 設定値：サブドメイン名
let kintoneSubDomainName = "";
// 設定値：アプリID
let kintoneAppId = "";
// 設定値：APIトークン
let kintoneAPIToken = "";


// イベント：起動時
app.on("ready", () => {
	// ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
	mainWindow = new BrowserWindow({
		width: 800,
		height: 650,
		// useContentSize: true
	});

	// 使用するhtmlファイルを指定する
	mainWindow.loadURL(`file://${__dirname}/views/index.html`);

	// 開発者ツールを表示する
	// mainWindow.webContents.openDevTools();

	// イベント：ウィンドウクローズ時
	mainWindow.on("closed", () => {
		// 以下の処理実行時、イベント：全てのウィンドウが閉じた場合が実行されます
		mainWindow = null;
	});


	// ローカルホストサーバを立ち上げ
	http.createServer(function (request, response) {
		// URLパラメータ取得
		let url_params = request.url.split('/');
		// URLパラメータの第一引数がない場合、棄却
		if (url_params.length < 2) return;

		// URLパラメータの第一引数をもとに処理を振り分ける
		var command = url_params[1];

		// 設定コマンドの場合、各種kintone設定値を埋め込む
		if (command.startsWith('setting?')) {
			let query = command.split('?')[1];
			let params = query.split('&');

			kintoneSubDomainName = params[0].split('=')[1];
			kintoneAppId = parseInt(params[1].split('=')[1]);
			kintoneAPIToken = params[2].split('=')[1];

			// console.log(kintoneSubDomainName)
			// console.log(kintoneAppId)
			// console.log(kintoneAPIToken)
			return;
		}

		switch (command) {
				// Tello：離陸
			case 'takeoff':
				TakeoffRequest();
				break;

				// Tello：着陸
			case 'land':
				LandRequest();
				break;

				// Tello：kintoneステータス送信
			case 'kintone':
				// kintone設定値が全て入力されている場合、各種コマンド操作を実行する
				if (kintoneSubDomainName && kintoneAppId && kintoneAPIToken) {

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

					/** Telloレスポンス取得 **/
					var resp = [];
					client.on('message', (msg, info) => {
						var telloData = msg.toString();
						var int = parseInt(telloData)
						resp.push(int)

						if (resp.length == 5) {
							/** 配列の取得 **/
							var telloSpeed = resp[0]
							var telloBattery = resp[1]
							var telloFlytime = resp[2]
							var telloHeight = resp[3]
							var telloTemperature = resp[4]

							/** kintoneへアクセス **/
							var entry_body = {
								'app': kintoneAppId,
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
								url: `https://${kintoneSubDomainName}.cybozu.com/k/v1/record.json`,
								method: 'POST',
								json: true,
								headers: {
									'X-Cybozu-API-Token': `${kintoneAPIToken}`,
									'Content-Type': 'application/json',
								},
								body: entry_body
							};
							request_module(params, function (err, res, body) {
								if (err) {
									console.log(err);
									return;
								}
								console.log(body);
							});
						}
					});
				}
				break;

				// Tello：上昇
			case 'up':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('up ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

				// Tello：下降
			case 'down':
				console.log('down')
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('down ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

				// Tello：左移動
			case 'left':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('left ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

				// Tello：右移動
			case 'right':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('right ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

				// Tello：前進
			case 'forward':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('forward ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

				// Tello：後進
			case 'back':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('back ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

				// Tello：右回転
			case 'cw':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('cw ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

				// Tello：左回転
			case 'ccw':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('ccw ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				client.on('message', function (msg, info) {
					console.log('Data received from server : ' + msg.toString());
					console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
				});
				break;

				// Tello：フリップ
			case 'flip':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				var message = new Buffer('flip ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

				// Tello：スピード変更
			case 'setspeed':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
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

// コマンド：離陸
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

// コマンド：着陸
function LandRequest() {
	var message = new Buffer('land');
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
	});
}

// イベント：全てのウィンドウが閉じた場合
app.on("window-all-closed", () => {
	// アプリ終了
	app.quit();
});

module.exports = app;