let ocrcheckcode = require('../main')
const fs = require('fs');
const request = require("request");
let jsonStudy = JSON.parse(fs.readFileSync(__dirname + '/jsonStudy.txt', 'utf8'));
isLoading = false;
let i=0;
let count = 0;
let time = new Date();
function getCheckWord (){
    return new Promise(function(resolve,reject){
        let checkword = '';
        let getcheckwordInner = function(){
            let savePath = __dirname + '/temp.png';
            ocrcheckcode.getPicCode(savePath, function (dataErzhi, dataHuigui, dataDirection) {
                if (dataErzhi.length == 4) {
                    //获取解析结果
                    ocrcheckcode.getPicWord(jsonStudy, savePath).then((data) => {
                        let code = '';
                        data.forEach((element) => {
                            code += element.word;
                        })
                        request('http://zxgk.court.gov.cn/zhzxgk/checkyzm?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&pCode=' + code, function (err, response, body) {
                            if (!err) {
                                if (body.replace(/\n/, '') == 1) {
                                    
                                } else {
                                    checkword();
                                }
                            } else {
                                checkword();
                            }
                        })

                    })
                } else {
                    console.log('解析个数不等于4')
                    checkword();
                }
            }, function () {

            })














        }
    })
}
function checkword(){
    i++;
    if(i>40){
        console.log(count)
        console.log(new Date()-time);
        return;
    }
    console.log(i)
    downloadImg('http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&random=0.7330692537629279', __dirname + '/temp.png').then((savePath) => {
        isLoading = false;
        ocrcheckcode.getPicCode(savePath, function (dataErzhi, dataHuigui, dataDirection) {
            if (dataErzhi.length==4){
                //获取解析结果
                ocrcheckcode.getPicWord(jsonStudy, savePath).then((data) => {
                        let code = '';
                        data.forEach((element) => {
                            code += element.word;
                        })
                        console.log(code,count)
                        request('http://zxgk.court.gov.cn/zhzxgk/checkyzm?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&pCode=' + code, function (err, response, body) {
                        if(!err){
                            if (body.replace(/\n/, '') == 1) {
                                    count++;
                                    if(count==1){
                                        console.log('s');
                                        request({
                                            url: 'http://zxgk.court.gov.cn/zhzxgk/searchZhcx.do',
                                            method: 'POST',
                                            headers:{
                                                "content-type": "application/json"
                                            },
                                            form:{
                                                pName: '邵军',
                                                pCardNum: '210104196007051212',
                                                selectCourtId:0,
                                                pCode: code,
                                                captchaId: 'bd2fd457ede44d26a018d71a2abf9fc7',
                                                searchCourtName: '全国法院（包含地方各级法院）',
                                                selectCourtArrange:1,
                                                currentPage:1
                                            }

                                        },
                                        function (err, httpResponse, body) {
                                            checkword();
                                            if(!err){
                                                console.log(body)
                                            }else{
                                                console.log(err)
                                            }
                                        })
                                    } else {
                                        console.log('f')
                                            checkword();
                                    }
                                }else{
                                            checkword();
                                }
                            }else{
                                            checkword();
                            }
                        })

                })
            }else{
                console.log('解析个数不等于4')
                checkword();
            }
        }, function () {

        })
    }).catch(err=>{
        console.log(err)
    })
}
checkword();

function downloadImg(url, savePath) {
    return new Promise(function (resolve, reject) {
        var writeStream = fs.createWriteStream(savePath);
        var readStream = request(url);
        readStream.pipe(writeStream);
        readStream.on('end', function () {
        });
        readStream.on('error', function (err) {
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

