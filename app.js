'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');

var ipc = require('ipc');
var dialog = require('dialog');

// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being GC'd
let mainWindow = null;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 1080,
		height: 720,
		resizable: false
	});

	ipc.on('open-file', function(e, type) {
		console.log(type);
		openFileDialog(type)
	});

	var shell = require('shell');

	mainWindow.loadUrl(`file://${__dirname}/index.html`);

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		mainWindow = null;
	});
});

var openFileDialog = function(type) {
	var filter = [];
	var filters = {
		image: { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
		music: { name: 'Music', extensions: ['mp3', 'mp4', 'ogg', 'flac'] }
	};
	var type = type || null;

	filter.push(filters[type]);

	var files = dialog.showOpenDialog({
		properties: ['openFile'],
		filters: filter
	});

	if (files) {
		console.log(files);
		var payload = {
			files: files,
			type: type
		};
		mainWindow.send('files-uploaded', payload);
	}
}