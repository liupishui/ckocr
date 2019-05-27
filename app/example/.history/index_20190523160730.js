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
    let dataCurr = []; //存储当前解析的结果
    let isLoading = false;
    let jsonStudy = JSON.parse(fs.readFileSync(__dirname+'jsonStudy.txt','utf8'));
    ipcMain.on('documentready',(event,arg)=>{
        if(isLoading){
            return;
        }
        isLoading = true;
        downloadImg('http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&random=0.7330692537629279',__dirname+'/temp.png').then((savePath) => {
            isLoading = false;
            ocrcheckcode.getPicCode(savePath, function (data) {
                dataCurr = data;
                event.sender.send('refresh', 1);
            }, function () {

            })
        })
    })
    ipcMain.on('reloadChkcode',(event,arg)=>{
        if(isLoading){
            return;
        }
        isLoading = true;
        if(arg!==''){
            // 将识别结果写入jsonStudy.txt
            arg.split('').forEach((element,index)=>{
                jsonStudy[element] = dataCurr[index];
            })
            fs.writeFileSync(__dirname + 'jsonStudy.txt', 'utf8');
        }

        downloadImg('http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&random=0.7330692537629279', __dirname + '/temp.png').then((savePath) => {
            isLoading = false;
            ocrcheckcode.getPicCode(savePath,function(data){
            dataCurr = data;
                event.sender.send('refresh', 1);
            },function(){

            })
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
    newWin.webContents.openDevTools();
}

function downloadImg(url,savePath){
    return new Promise(function(resolve,reject){
        var writeStream = fs.createWriteStream(savePath);
        var readStream = request(url)
        readStream.pipe(writeStream);
        readStream.on('end', function () {
        });
        readStream.on('error', function () {
            reject(err);
            // console.log("错误信息:" + err)
        })
        writeStream.on("finish", function () {
            // console.log("文件写入成功");
            writeStream.end();
            resolve(savePath)
        });
    })
}


