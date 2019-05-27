let ocrcheckcode = require('../main')
let electron = require('electron')
let {app, BrowserWindow} =require('electron'); 
console.log(ocrcheckcode)
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
     newWin.loadURL('index.html');
}
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


