let getPicCode = require('./getPicCode');
let getPicWord = require('./getPicWord');
const fs = require('fs');
const request = require("request");
//let jsonStudyArr = JSON.parse(fs.readFileSync(__dirname + '/jsonStudy.txt', 'utf8'));
function getRst(jsonStudyArr, codeSavePath, urlCode, urlCodeCheck, urlGetRst, codeCurrPath,handlerFormdata) {
    /*
    * @jsonStudyArr 学习到的数据集合 object
    * @codeSavePath 验证码存放路径 string
    * @urlCode      验证码的url地址 string
    * @urlCodeCheck 验证码的验证地址 string
    * @urlGetRst    通过验证码获取提交表单地址 string
    * @codeCurrPath 存放验证码解析后结果的路径 string
    * @handlerFormdata 处理解析到的验证码 function
    */
    return new Promise(function(resolve,reject){
        getCheckWord(jsonStudyArr,codeSavePath, urlCode, urlCodeCheck,codeCurrPath).then((code) => {
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

function getCheckWord(jsonStudyArr,codeSavePath, urlCode, urlCodeCheck,codeCurrPath) {
    let codeCurr = fs.readFileSync(codeCurrPath,'utf8');
    return new Promise(function (resolve, reject) {
        let neadReload = false;
        let neadReloadCode = false;
        let getcheckwordInner = function () {
            let savePath = codeSavePath;
            if (neadReload == false) {
                //判断是否已经存在验证码，已经存则直接直行，不存在则重新获取
                if (codeCurr != '' && neadReloadCode==false) { //
                    request(urlCodeCheck + code, function (err, response, body) {
                        if (!err) {
                            if (body.replace(/\n/, '') == 1) {
                                resolve(code)
                            } else {
                                neadReloadCode = true;
                                getcheckwordInner();
                            }
                        } else {
                            neadReloadCode = true;
                            getcheckwordInner();
                        }
                    })
                } else {
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
                                            codeCurr = code;
                                            neadReloadCode = false;//如果已经解析到了，下一次则直接使用
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
                }
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
