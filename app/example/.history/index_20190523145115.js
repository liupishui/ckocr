let ocrcheckcode = require('../main')
const electron = require('electron');
const fs = require('fs');
// Module to control application life.

// Module to create native browser window.
const {app,Menu,BrowserWindow} = electron;
console.log('sss', BrowserWindow)
let newWin = '';
let loadMainProgram = function () {
     newWin = new BrowserWindow({
         title: '学习训练',
         webPreferences: {
             nodeIntegration: true,
             nodeIntegrationInWorker: true,
             webviewTag: true
         },
         frame: true,
         width: 818,
         resizable: false,
         height: 602,
         center: true,
         movable: true,
         show: false
         //icon: __dirname + '/img/icon.png'
     })
     newWin.setMenu(null);
     newWin.webContents.on('did-finish-load', function () {
         newWin.show();
     });
     newWin.on('closed', () => {
         newWin = null;
     })
     newWin.loadURL('./index.html');
}


