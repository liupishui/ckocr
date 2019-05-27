let ocrcheckcode = require('../main')
const electron = require('electron');
const fs = require('fs');
const request = require("request");

// Module to control application life.

// Module to create native browser window.
const {
    app,
    BrowserWindow,
    ipcMain
} = electron;
console.log(ocrcheckcode)
let newWin = '';
app.on('ready',()=>{
    loadMainProgram();
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (newWin == '') {
        loadMainProgram();
        //createWindow(`file://${__dirname}/index.html`);
    }
});


function loadMainProgram() {
    //创建窗口
    createWindow (`file://${__dirname}/index.html`);
    ipcMain.on('reloadChkcode',(event,arg)=>{
        downloadImg().then(()=>{
            event.send('refresh',1);
        })
    })
}


function createWindow(URL){
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
    newWin.loadURL(URL);
}

function downloadImg(url,savePath){
    let request = require()
    var writeStream = fs.createWriteStream('image' + Start + '.png');
    var readStream = request(src)
    readStream.pipe(writeStream);
    readStream.on('end', function () {
        console.log('文件下载成功');
        getPicCode('image' + Start + '.png', function (data) {
            codeInfo.push({
                num: Start,
                data: data
            })
            getPicCodeInfo();
        }, function () {

        })
    });
    return new Promise(function(resolve,reject){

    })
}


