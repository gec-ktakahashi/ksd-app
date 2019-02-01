"use strct";

// Electron
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

// http
const http = require('http');
const kintoneRequest = require('request');
const fs = require('fs');
const url = require('url');

const dgram = require('dgram');
const client = dgram.createSocket('udp4');
// const async = require('asyncawait/async');
// const await = require('asyncawait/await');


// Express
const express = require("express");
const exapp = express();
var router = express.Router();


// Telloドローン IP,PORT
let PORT = 8889;
let HOST = '192.168.10.1';

// let dataToTrack_keys = ["speed", "battery", "fly_time", "height", "temperature", "tof", "acceleration"];
// let lastDataReceived = null;


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

			case 'poll':
				// respondToPoll(response);
				break;


			case 'command':
				var command = new Buffer('command');
				client.send(command, 0, command.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			/**** 離陸 ****/
			case 'takeoff':
				console.log('takeoff');
				TakeoffRequest();
				break;


			/***** 速度 *****/
			case 'speed':
				console.log('speed')

				var message_speed = new Buffer('speed?');
				client.send(message_speed, 0, message_speed.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;

				});
				var telloSpeed = "";
				client.on('message', (msg, info) => {
					console.log(msg)
					console.log(info)
					telloSpeed = msg.toString();
					console.log(telloSpeed)

					if (telloSpeed != "ok") {
						/*** kintoneへアクセス ***/
						var entry_body = {
							'app': 350,
							'record': {
								'speed': {
									"value": telloSpeed
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


			/**** バッテリー残量 ****/
			case 'battery':
				console.log("battery")

				var message_battery = new Buffer('battery?');
				client.send(message_battery, 0, message_battery.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				var tello_battery = "";
				client.on('message', (msg, info) => {
					tello_battery = msg.toString();

					if (tello_battery != "ok") {
						/*** kintoneへアクセス ***/
						var entry_body = {
							'app': 350,
							'record': {
								'battery': {
									"value": tello_battery
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


			/**** 飛行時間 ****/
			case 'flyTime':
				console.log("flyTime")

				var message = new Buffer('time?');
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				var tello_time = "";
				client.on('message', (msg, info) => {
					tello_time = msg.toString();

					if (tello_time != "ok") {
						/*** kintoneへアクセス ***/
						var entry_body = {
							'app': 350,
							'record': {
								'fly_time': {
									"value": tello_time
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
						});
					}
				});
				break;


			/**** 高度 ****/
			case 'height':
				console.log("height")

				var message = new Buffer('height?');
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				var tello_height = "";
				client.on('message', (msg, info) => {
					tello_height = msg.toString();

					if (tello_height != "ok") {
						/*** kintoneへアクセス ***/
						var entry_body = {
							'app': 350,
							'record': {
								'height': {
									"value": tello_height
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
						});
					}
				});
				break;



			/**** 気温 ****/
			case 'temp':
				console.log("temp")

				var message = new Buffer('temp?');
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				var temperture = "";
				client.on('message', (msg, info) => {
					temperture = msg.toString();

					if (temperture != "ok") {
						/*** kintoneへアクセス ***/
						var entry_body = {
							'app': 350,
							'record': {
								'temperature': {
									"value": temperture
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
						});
					}
				});
				break;


			/**** 加速度 ****/
			case 'acceleration':
				console.log("acceleration")

				var message = new Buffer('acceleration?');
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				var tello_acceleration = "";
				client.on('message', (msg, info) => {
					tello_acceleration = msg.toString();

					if (tello_acceleration != "ok") {
						/*** kintoneへアクセス ***/
						var entry_body = {
							'app': 350,
							'record': {
								'acceleration': {
									"value": tello_acceleration
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
						});
					}
				});
				break;


			/**** TOFからの距離 ****/
			case 'tof':
				console.log("tof")

				var message = new Buffer('tof?');
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				var tof= "";
				client.on('message', (msg, info) => {
					tof = msg.toString();

					if (tof != "ok") {
						/*** kintoneへアクセス ***/
						var entry_body = {
							'app': 350,
							'record': {
								'tof': {
									"value": tof
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
						});
					}
				});
				break;

			/**** 着陸 ****/
			case 'land':
				console.log('land');
				LandRequest();
				break;

			case 'up':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('up ' + dis);
				var message = new Buffer('up ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			case 'down':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('down ' + dis);
				var message = new Buffer('down ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			case 'left':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('left ' + dis);
				var message = new Buffer('left ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			case 'right':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('right ' + dis);
				var message = new Buffer('right ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			case 'forward':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('forward ' + dis);
				var message = new Buffer('forward ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			case 'back':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('back ' + dis);
				var message = new Buffer('back ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			case 'cw':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('cw ' + dis);
				var message = new Buffer('cw ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			case 'flip':
				dis = (url_params.length >= 3) ? url_params[2] : 0;
				console.log('flip' + dis);
				var message = new Buffer('flip ' + dis);
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});
				break;

			case 'ccw':
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

			case 'setspeed':
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

/**** Telloドローンからのresponseデータ ****/
function respondToPoll(response) {

	var message = new Buffer('command');

	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
	});


	var noDataReceived = false;
	var resp = [];

	var message = new Buffer('battery?');
	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;

	});
	client.on('message', (msg, info) => {
		var tello_battery = msg.toString();
		resp.push(tello_battery)
		console.log(resp)
	});
}


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

	/*** kintoneへアクセス ***/
	var entry_body = {
		'app': 350,
		'record': {
			'takeOff':{
				'value':'1'
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
	});

}


/***** 着陸 *****/
function LandRequest() {
	var message = new Buffer('land');

	client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
		if (err) throw err;
	});

	/*** kintoneへアクセス ***/
	var entry_body = {
		'app': 350,
		'record': {
			'land':{
				'value':'0'
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