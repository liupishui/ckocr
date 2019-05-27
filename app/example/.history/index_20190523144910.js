let ocrcheckcode = require('../main')
const electron = require('../../node_modules/electron');
const Menu = require('electron').Menu;
const fs = require('fs');
// Module to control application life.
const app = electron.app;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
console.log('sss', require('../../node_modules/electron').app)
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
// app.on('ready',()=>{
//     loadMainProgram();
// })
// // Quit when all windows are closed.
// app.on('window-all-closed', () => {
//     // On OS X it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });

// app.on('activate', () => {
//     // On OS X it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (newWin == '') {
//         loadMainProgram();
//         //createWindow(`file://${__dirname}/index.html`);
//     }
// });


