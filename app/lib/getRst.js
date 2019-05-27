let getPicCode = require('./getPicCode');
let getPicWord = require('./getPicWord');
const fs = require('fs');
const request = require("request");
//let jsonStudyArr = JSON.parse(fs.readFileSync(__dirname + '/jsonStudy.txt', 'utf8'));
function getRst(jsonStudyArr,codeSavePath,urlCode,urlCodeCheck,urlGetRst,handlerFormdata){
    /*
    * @jsonStudyArr 学习到的数据集合 object
    * @codeSavePath 验证码存放路径 string
    * @urlCode      验证码的url地址 string
    * @urlCodeCheck 验证码的验证地址 string
    * @urlGetRst    通过验证码获取提交表单地址 string
    * @handlerFormdata 处理解析到的验证码 function
    */
    return new Promise(function(resolve,reject){
        getCheckWord(jsonStudyArr,codeSavePath, urlCode, urlCodeCheck).then((code) => {
            request({
                    url: urlGetRst,
                    method: 'POST',
                    headers: {
                        "content-type": "application/json"
                    },
                    form: handlerFormdata(code)
                },
                function (err, httpResponse, body) {
                    if (!err) {
                        resolve(body)
                    } else {
                        reject(err);
                    }
                })
        })
    })

}

function getCheckWord(jsonStudyArr,codeSavePath, urlCode, urlCodeCheck) {
    return new Promise(function (resolve, reject) {
        let neadReload = false;
        let getcheckwordInner = function () {
            let savePath = codeSavePath;
            if (neadReload == false) {
                getPicCode(savePath, function (dataErzhi, dataHuigui, dataDirection) {
                    if (dataErzhi.length == 4) {
                        //获取解析结果
                        getPicWord(jsonStudyArr, savePath).then((data) => {
                            let code = '';
                            data.forEach((element) => {
                                code += element.word;
                            })
                            request(urlCodeCheck + code, function (err, response, body) {
                                if (!err) {
                                    if (body.replace(/\n/, '') == 1) {
                                        resolve(code)
                                    } else {
                                        neadReload = true;
                                        getcheckwordInner();
                                    }
                                } else {
                                    neadReload = true;
                                    getcheckwordInner();
                                }
                            })

                        })
                    } else {
                        neadReload = true;
                        console.log('解析个数不等于4')
                        getcheckwordInner();
                    }
                }, function () {
                    neadReload = true;
                    getcheckwordInner();
                })
            } else {
                downloadImg(urlCode, savePath).then(() => {
                    neadReload = false;
                    getcheckwordInner();
                })
            }
        }
        getcheckwordInner();
    })
}

function downloadImg(url, savePath) {
    return new Promise(function (resolve, reject) {
        var writeStream = fs.createWriteStream(savePath);
        var readStream = request(url);
        readStream.pipe(writeStream);
        readStream.on('end', function () {});
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

module.exports = getRst;
