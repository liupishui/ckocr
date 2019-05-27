let fs = require('fs');
let _ = require('lodash');
let getPicCode = require('./getPicCode');
function getPicWord (jsonSudy, picPath,type) {
    if(type){
    }else{
        type = 'erzhi'
    }
    return new Promise(function(resolve,reject){
        getPicCode(picPath, function (dataErzhi, dataHuigui, dataDirection) {
            //console.log(tmpCodeArr)
            let tmpCodeArr = [];
            if (type =='erzhi'){
                tmpCodeArr = dataErzhi;
            }else if(type=='huigui'){
                tmpCodeArr = dataHuigui;
            }else if(type=='direction'){
                tmpCodeArr = dataDirection;
            }
            let countCode = [];
            // if (tmpCodeArr.length > 3) {
            if (tmpCodeArr.length > 0) {
                jsonSudyNoSpace = {};
                for(let x in jsonSudy){
                    jsonSudyNoSpace[x]=[];
                    for(let curr in jsonSudy[x]){
                        jsonSudyNoSpace[x].push(jsonSudy[x][curr].replace(/\r\n/g, '').split(''))
                    }
                }
                tmpCodeArr.forEach((tempOrg, indexTempOrg) => {
                    //let tempOrg = "000001111111000000000000\r\n000111111111110000000000\r\n011111111111111000000000\r\n011111100011111100000000\r\n111110000000111110000000\r\n011100000000111110000000\r\n011000000000011111000000\r\n000000000000001111000000\r\n000000000000111111100000\r\n000000000111111111100000\r\n000000001111111111110000\r\n000000111111000111110000\r\n000001111100000011110000\r\n000001111000000011111000\r\n000011110000000011111000\r\n000111110000000011111000\r\n000111100000000111111000\r\n000111100000001111111111\r\n001111100000011111111111\r\n001111110001111101111111\r\n001111111111111000111110\r\n001111111111100000000000\r\n001111111111000000000000\r\n001111111100000000000000\r\n000111111000000000000000\r\n";
                    temp = tempOrg.replace(/\r\n/g, '')
                    let tempArr = temp.split('');
                    //let find = false;
                    let similarityNumArr = [];
                    let similarityObj = {
                        word:'0',
                        num:0
                    }
                    for (let x in jsonSudyNoSpace) {
                        // let eachLength = jsonSudy[x].length;
                        for (let codeCurrIndex in jsonSudyNoSpace[x]) {
                            let codeCurrArr = jsonSudyNoSpace[x][codeCurrIndex];
                            let MaxLength = Math.max.apply(null, [tempArr.length, codeCurrArr.length])
                            // let MinLength = Math.min.apply(null, [tempArr.length, codeCurrArr.length])
                            // if (x == '6') {
                            //     if (codeCurrIndex==6){
                            //         console.log(codeCurrOrg);
                            //     }
                            // }
                            // if (tempArr.length < MaxLength) {
                            //     // tempArr = [...tempArr,...new Array(MaxLength-MinLength).fill(0)];
                            //     for (let start = tempArr.length; start < MaxLength; start++) {
                            //         tempArr.push(0);
                            //     }
                            // }
                            // if (codeCurrArr.length < MaxLength) {
                            //     // codeCurrArr = [...codeCurrArr, ...new Array(MaxLength - MinLength).fill(0)];
                            //     for (let start = codeCurrArr.length; start < MaxLength; start++) {
                            //         codeCurrArr.push(0);
                            //     }
                            // }
                            //https://blog.csdn.net/shijing_0214/article/details/53100992 
                            //https://www.cnblogs.com/airnew/p/9563703.html //余弦公式计算相似度
                            let summaryTop = 0,
                                summaryA = 0,
                                summaryB = 0;
                            for (let count = 0; count < MaxLength; count++) {
                                //summaryTop += (tempArr[count] - 0) * (codeCurrArr[count] - 0); //相乘速度慢
                                summaryTop += Number(tempArr[count]||0) && Number(codeCurrArr[count]||0);
                                // summaryA += tempArr[count] * tempArr[count];//因为0*0=0 1*1=1；所以直接相加
                                summaryA += Number(tempArr[count]||0);
                                summaryB += Number(tempArr[count]||0);
                            }
                            // if(!find){
                            //     find=false;
                            let similarityNum = summaryTop / (Math.sqrt(summaryA) * Math.sqrt(summaryB)); //余弦公式计算相似度

                            //海明距离计算开始
                            // let haimingjuli = 0;
                            // for (let start = 0; start < MaxLength; start++) {
                            //     haimingjuli += (codeCurrArr[start] == tempArr[start]);
                            // }

                            // if (indexTempOrg==0){
                            //     console.log({
                            //         x,
                            //         similarityNum,
                            //         haimingjuli
                            //     })
                            // }
                            if (similarityNum > similarityObj.num){
                                similarityObj.num = similarityNum;
                                similarityObj.word = x;
                            }
                            // similarityNumArr.push({
                            //     word: x,
                            //     num: similarityNum
                            // })
                            // }
                        }
                        //console.log(_.uniq(dictionaryString[x]).length != eachLength);
                    }
                    //countCode.push(_.maxBy(similarityNumArr, 'num'));
                    countCode.push(similarityObj);
                })
                resolve(countCode)
                //console.log(countCode)
            };
        }, function (err) {
            reject(err)
            //console.log(err)
        });



    });
}
// let dataArr = JSON.parse(data);
// for(let item of dataArr){
//     console.log(item)
// }
module.exports = getPicWord;


