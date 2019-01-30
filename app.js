"use strct";

// Electron
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

const http = require('http');
const request = require('request');
const fs = require('fs');
const url = require('url');

const dgram = require('dgram');
const client = dgram.createSocket('udp4');



// Telloドローン IP,PORT
let PORT = 8889;
let HOST = '192.168.10.1';

let dataToTrack_keys = ["battery", "streamon", "streamoff"];
let lastDataReceived = null;


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

			case 'kintone':
				console.log("success")

				// バッテリー
				var message = new Buffer('streamon');

				let telloBattery = "";
				client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
					if (err) throw err;
				});

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


function respondToPoll(response) {
	var noDataReceived = false;

	var resp = "";
	var i;
	for (i = 0; i < dataToTrack_keys.length; i++) {
		resp += dataToTrack_keys[i] + " ";
		resp += (i + 10);
		resp += "\n";
	}
	response.end(resp);

	console.log("-------------------------------------------------------------");
	console.log(new Date());
	console.log(resp);
}

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