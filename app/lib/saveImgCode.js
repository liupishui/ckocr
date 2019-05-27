// let fs = require('fs');
// // http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&random=0.7330692537629279
// let url = 'http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&random=0.7330692537629279';
// getPicCode('./image.jpg',function(data){
//     console.log(data)
// },function(err){
//         if (err.message = 'SOI not found'){
//             err.message = "图片的后缀和图片的实际格式不一致";
//         }
//     console.log(err.message)
// })
let getPicCode = require('./getPicCode');
var fs = require('fs');
var request = require("request");
var src = "http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&random=0.7330692537629279";
let Start = 0;
let codeInfo = [];
let getPicCodeInfo = function(){
    Start++;
    if(Start>5){
        console.log(codeInfo)
        fs.writeFileSync('imgcodeData.txt',JSON.stringify(codeInfo));
        return;
    }
    var writeStream = fs.createWriteStream('image'+Start+'.png');
    var readStream = request(src)
    readStream.pipe(writeStream);
    readStream.on('end', function () {
        console.log('文件下载成功');
        getPicCode('image' + Start + '.png',function(data){
            codeInfo.push({num:Start,data:data})
            getPicCodeInfo();
        },function(){

        })
    });
    readStream.on('error', function () {
        console.log("错误信息:" + err)
    })
    writeStream.on("finish", function () {
        console.log("文件写入成功");
        writeStream.end();
    });
}
getPicCodeInfo()

