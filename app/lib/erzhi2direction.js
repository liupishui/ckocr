const fs = require('fs');
let ndarray = require('ndarray');
let _ = require('lodash');
function erzhi2direction(path){
    let erzhiArr = JSON.parse(fs.readFileSync(path,'utf8'));
    let directionArr = {};
    for(var x in erzhiArr){
        directionArr[x] = [];
        erzhiArr[x].forEach((element,index)=>{
            let erzhiEveryCurr = element.split('\r\n');
            let grayArray = ndarray(element.replace(/\r\n/g, 0).split(''), [erzhiEveryCurr.length, erzhiEveryCurr[0].length], [1, erzhiEveryCurr[0].length, 1], 0); //存储灰度信息;
            directionArr[x].push(grayArray2DirectionString(grayArray))
        })
    }
    return directionArr;
} 

function grayArray2DirectionString(grayArray){
        let firstWordLoaction = [];
        let wordDirectionStr = '';
        let firstWordLoactionX_Min = 0;
        let firstWordLoactionX_Max = 0;
        let firstWordLoactionY_Min = 0;
        let firstWordLoactionY_Max = 0;
        let startX_init = firstWordLoactionX_Max;
        for (let startX = startX_init; startX < grayArray.shape[1]; startX++) { //横向扫描
            for (let h = 0; h < grayArray.shape[0]; h++) { //竖向扫描
                //console.log(grayArray.get(w, h, 1))
                if (grayArray.get(startX, h, 0) == 1) {
                    // if(startX==71){
                    //     console.log('->',grayArray.get(startX, h, 0));
                    // }

                        firstWordLoactionX_Min = startX;
                        firstWordLoactionX_Max = startX;
                        firstWordLoactionY_Min = h;
                        firstWordLoactionY_Max = h;
                        // if(count == 2){
                        //     console.log({ x: startX, y: h })
                        // }
                        //console.log(firstWordLoaction);
                        let findNextPixel = function (x, y) {
                            // 判断点是否在图形内
                            if (x > -1 && y > -1 && x <= grayArray.shape[1] && y <= grayArray.shape[0]) {
                                //如果未添加进firstWordLocation则继续操作
                                if (grayArray.get(x, y, 0) == 1) {
                                    wordDirectionStr += '1';
                                    if (_.filter(firstWordLoaction, function (o) {
                                        return o.x == x && o.y == y
                                    }).length == 0) {
                                        //上，上右，右，右下，下，左下，左，左上有一个在firstWordLoaction,则添加进特征码
                                        let hasTop = _.filter(firstWordLoaction, function (o) {
                                            return o.x == x && o.y == (y - 1)
                                        }).length > 0;
                                        let hasTopRight = _.filter(firstWordLoaction, function (o) {
                                            return o.x == (x + 1) && o.y == (y - 1)
                                        }).length > 0;
                                        let hasRight = _.filter(firstWordLoaction, function (o) {
                                            return o.x == (x + 1) && o.y == y
                                        }).length > 0;
                                        let hasRightBottom = _.filter(firstWordLoaction, function (o) {
                                            return o.x == (x + 1) && o.y == (y + 1)
                                        }).length > 0;
                                        let hasBottom = _.filter(firstWordLoaction, function (o) {
                                            return o.x == x && o.y == (y + 1)
                                        }).length > 0;
                                        let hasBottomLeft = _.filter(firstWordLoaction, function (o) {
                                            return o.x == (x - 1) && o.y == (y + 1)
                                        }).length > 0;
                                        let hasLeft = _.filter(firstWordLoaction, function (o) {
                                            return o.x == (x - 1) && o.y == y
                                        }).length > 0;
                                        let hasTopLet = _.filter(firstWordLoaction, function (o) {
                                            return o.x == (x - 1) && o.y == (y - 1)
                                        }).length > 0;
                                        if (hasTop || hasTopRight || hasRight || hasRightBottom || hasBottom || hasBottomLeft || hasLeft || hasTopLet) {
                                            firstWordLoaction.push({
                                                x: x,
                                                y: y
                                            });
                                            firstWordLoactionX_Min > x ? firstWordLoactionX_Min = x : '';
                                            firstWordLoactionX_Max < x ? firstWordLoactionX_Max = x : '';
                                            firstWordLoactionY_Min > y ? firstWordLoactionY_Min = y : '';
                                            firstWordLoactionY_Max < y ? firstWordLoactionY_Max = y : '';
                                            findNextPixel(x, y - 1); //上
                                            findNextPixel(x + 1, y - 1); //上右
                                            findNextPixel(x + 1, y); //右
                                            findNextPixel(x + 1, y + 1); //右下
                                            findNextPixel(x, y + 1); //下
                                            findNextPixel(x - 1, y + 1); //左下
                                            findNextPixel(x - 1, y); //左
                                            findNextPixel(x - 1, y - 1); //左上
                                        }
                                    }
                                } else {
                                    wordDirectionStr += '0';
                                }
                            }
                        }
                        findNextPixel(startX, h - 1); //上
                        findNextPixel(startX + 1, h - 1); //上右
                        findNextPixel(startX + 1, h); //右
                        findNextPixel(startX + 1, h + 1); //右下
                        findNextPixel(startX, h + 1); //下
                        //由于是从左往右，从上往下扫描第一个点的左侧和上侧是没有点的
                        findNextPixel(startX - 1, h + 1); //左下
                        findNextPixel(startX - 1, h); //左
                        findNextPixel(startX - 1, h - 1); //左上
                        // console.log(grayArray.data[w * h])
                        // console.log('ggg', w, h)
                }
            }
        }








    return wordDirectionStr;
}
module.exports = erzhi2direction