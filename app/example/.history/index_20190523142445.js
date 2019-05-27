let ocrcheckcode = require('../main')
let electron = require('electron')
let {app, BrowserWindow} =require('electron'); 
console.log(ocrcheckcode)
new BrowserWindow({
    title:'学习训练',
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

