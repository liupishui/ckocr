//https://blog.csdn.net/protossrr/article/details/56018475
let getPixels = require('get-pixels');
var ndarray = require('ndarray')
//let fs = require('fs');
let _ = require('lodash');
//'./untitled1.png'

/*
 *定义求线性回归A和B的函数
 *@param $zuobiaoArray坐标的三维数组
 */
function getHuigui($zuobiaoArray) {
    let $y8 = 0;
    let $x8 = 0;
    let $x2 = 0;
    let $xy = 0;
    let $geshu = $zuobiaoArray.length;
    for (let $i = 0; $i < $geshu; $i++) {
        $y8 = $y8 + $zuobiaoArray[$i]['y'];
        $x8 = $x8 + $zuobiaoArray[$i]['x'];
        $xy = $xy + $zuobiaoArray[$i]['y'] * $zuobiaoArray[$i]['x'];
        $x2 = $x2 + $zuobiaoArray[$i]['x'] * $zuobiaoArray[$i]['x'];;
    }
    $y8 = $y8 / $geshu;
    $x8 = $x8 / $geshu;

    let $b = ($xy - $geshu * $y8 * $x8) / ($x2 - $geshu * $x8 * $x8);
    let $a = $y8 - $b * $x8;
    return {
        a: $a,
        b: $b
    };
    //y = b * x + a
}

/*
 *定义转化坐标的函数
 *@param $x x坐标即$i
 *@param $y y坐标，即j
 *@param $b 线性回归方程的b参数 
 */
function getNewZuobiao($x, $y, $b) {
    let $xianJiao = 0;
    let $p = {};
    if ($x == 0) {
        if ($y > 0) {
            $xianJiao = Math.PI / 2;
        } else if ($y < 0) {
            $xianJiao = Math.PI / 2;
        } else {
            $p['x'] = 0;
            $p['y'] = 0;
        }
    } else {
        $xianJiao = Math.atan($y / $x);
    }
    if (typeof ($p.x) == 'undefined') {
        let $jiao = $xianJiao - Math.atan($b);
        let $chang = Math.sqrt($x * $x + $y * $y);
        $p['x'] = $chang * Math.cos($jiao);
        $p['y'] = $chang * Math.sin($jiao);
    }
    return $p;
}
//获取图片内各个字符的特征值
let getPicCode = function (path, callback, errCallback) {
    getPixels(path, function (err, pixels) {
        if (!err) {
            //pixels.shape[0] 宽度
            //pixels.shape[1] 高度
            //console.log(pixels.shape)
            //console.log(pixels)
            let grayArrayDataX = [];
            let dataRst = '';
            let dataRstErZhiAll ='';
            for (let h = 0; h < pixels.shape[1]; h++) { //横向灰度信息
                for (let w = 0; w < pixels.shape[0]; w++) {
                    let colorR = pixels.get(w, h, 0); //红色
                    let colorG = pixels.get(w, h, 1); //绿色
                    let colorB = pixels.get(w, h, 2); //蓝色
                    let GrayInfo = (125 * colorR + 125 * colorG + 125 * colorB) / 1000
                    if (GrayInfo < 80) {
                        dataRst += "■"
                        dataRstErZhiAll += 1;
                        grayArrayDataX.push('1');
                        //console.log(grayArrayData)
                    } else {
                        dataRst += "□"
                        dataRstErZhiAll += 0;
                        grayArrayDataX.push('0');
                        //上下左右都有点则补全
                        //上
                        // let top = (125 * pixels.get(w, h - 1, 0) + 125 * pixels.get(w, h - 1, 0) + 125 * pixels.get(w, h - 1, 0)) / 1000 < 80
                        // let right = (125 * pixels.get(w+1, h, 0) + 125 * pixels.get(w+1, h, 0) + 125 * pixels.get(w+1, h, 0)) / 1000 < 80
                        // let bottom = (125 * pixels.get(w, h + 1, 0) + 125 * pixels.get(w, h + 1, 0) + 125 * pixels.get(w, h + 1, 0)) / 1000 < 80
                        // let left = (125 * pixels.get(w-1, h , 0) + 125 * pixels.get(w-1, h, 0) + 125 * pixels.get(w-1, h, 0)) / 1000 < 80
                        // if (top&&right&&bottom&&left){
                        //     dataRst += "■"
                        // }else{
                        //     dataRst += "□"
                        // }
                    }
                    // if (colorR < 255){
                    //     console.log(w,h,colorR)
                    // }
                }
                dataRst += '\r\n';
                dataRstErZhiAll += '\r\n';
            }

            let grayArray = ndarray(grayArrayDataX, [pixels.shape[1], pixels.shape[0]], [1, 1 * pixels.shape[0], 1], 0); //存储灰度信息;
            //console.log(grayArray);
            // for (var i = 0; i < grayArray.data.length; i++) {
            //     if (grayArray.data[i] == 1) {
            //         console.log(1)
            //     } else {
            //         //console.log(2)
            //     }
            // } // console.log(grayArray)
            let fontsAllInfo = [];
            // 查找所有字体信息
            var findAllFontsInfo = function () {
                let firstWordLoaction = [];
                let wordDirectionStr = '';
                let firstWordLoactionX_Min = 0;
                let firstWordLoactionX_Max = 0;
                let firstWordLoactionY_Min = 0;
                let firstWordLoactionY_Max = 0;
                let find = false;
                let startX_init = firstWordLoactionX_Max;
                // count ++;
                // if(count>2){
                //     return;
                // }
                if (fontsAllInfo.length != 0) {
                    startX_init = fontsAllInfo[fontsAllInfo.length - 1].x_max + 1;
                    // console.log('x_min',fontsAllInfo[fontsAllInfo.length - 1].x_min)
                    // console.log('x_max',fontsAllInfo[fontsAllInfo.length - 1].x_max)
                    // console.log('y_min',fontsAllInfo[fontsAllInfo.length - 1].y_min)
                    // console.log('y_max',fontsAllInfo[fontsAllInfo.length - 1].y_max)
                }
                for (let startX = startX_init; startX < grayArray.shape[1]; startX++) { //横向扫描
                    for (let h = 0; h < grayArray.shape[0]; h++) { //竖向扫描
                        //console.log(grayArray.get(w, h, 1))
                        if (grayArray.get(startX, h, 0) == 1) {
                            // if(startX==71){
                            //     console.log('->',grayArray.get(startX, h, 0));
                            // }
                            if (!find) {
                                find = true;
                                firstWordLoaction.push({
                                    x: startX,
                                    y: h
                                });
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
                                    if (x > 69) {
                                        //console.log(grayArray)
                                    }
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
                                        }else{
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
                }
                if (find) {
                    // console.log('------------',firstWordLoactionX_Max)
                    fontsAllInfo.push({
                        wordDirectionStr: wordDirectionStr,
                        fontSite: firstWordLoaction,
                        x_min: firstWordLoactionX_Min,
                        x_max: firstWordLoactionX_Max,
                        y_min: firstWordLoactionY_Min,
                        y_max: firstWordLoactionY_Max
                    })
                    findAllFontsInfo();
                }
            }
            findAllFontsInfo()
            // console.log(fontsAllInfo)
            let finalFontsAllInfo = [],
                finalFontsAllInfoHuigui = [],
                finalFontsAllInfoDirection = [];
            for (let i = 0; i < fontsAllInfo.length; i++) {
                let fontInfoTmp = '';
                let zuobiaoFoo = []; //线性回归用的数组
                let finalFontsSite = [];

                for (let y = fontsAllInfo[i].y_min; y < fontsAllInfo[i].y_max + 1; y++) {
                    let xAccount = 0,
                        chuxianCishu = 0;
                    for (let x = fontsAllInfo[i].x_min; x < fontsAllInfo[i].x_max + 1; x++) {
                        if (_.filter(fontsAllInfo[i].fontSite, function (o) {
                                return o.x == x && o.y == y
                            }).length) {
                            finalFontsSite.push({
                                x: x - fontsAllInfo[i].x_min,
                                y: y - fontsAllInfo[i].y_min
                            })
                            fontInfoTmp += '1';
                            xAccount += x - fontsAllInfo[i].x_min;
                            chuxianCishu++;
                        } else {
                            fontInfoTmp += '0';
                        }
                    }
                    fontInfoTmp += '\r\n';
                    if (chuxianCishu == 0) {
                        zuobiaoFoo.push({
                            x: y - fontsAllInfo[i].y_min,
                            y: (fontsAllInfo[i].x_max - fontsAllInfo[i].x_min) / 2
                        })
                    } else {
                        zuobiaoFoo.push({
                            x: y - fontsAllInfo[i].y_min,
                            y: xAccount / chuxianCishu
                        })
                    }
                }
                finalFontsAllInfo.push(fontInfoTmp);//二值化添加进数组
                //console.log(fontInfoTmp)
                //回归矫正
                let rstHuigui = getHuigui(zuobiaoFoo);
                let finalFontsSiteJiaozhengTmp = [];
                finalFontsSite.forEach(function (fontSite) {
                    let newZuobiao = getNewZuobiao(fontSite.x, fontSite.y, rstHuigui.b);
                    finalFontsSiteJiaozhengTmp.push({
                        x: Math.round(newZuobiao.x),
                        y: Math.round(newZuobiao.y)
                    })
                })
                let huiguiFontTezheng = '';
                let x_min_huigui = _.minBy(finalFontsSiteJiaozhengTmp, 'x'),
                    x_max_huigui = _.maxBy(finalFontsSiteJiaozhengTmp, 'x'),
                    y_min_huigui = _.minBy(finalFontsSiteJiaozhengTmp, 'y'),
                    y_max_huigui = _.maxBy(finalFontsSiteJiaozhengTmp, 'y');
                let xLength = x_max_huigui.x - x_min_huigui.x,
                    yLength = y_max_huigui.y - y_min_huigui.y;
                for (let y = 0; y < yLength + 1; y++) {
                    for (let x = 0; x < xLength + 1; x++) {
                        if (_.filter(finalFontsSiteJiaozhengTmp, function (o) {
                                return o.x == (x_min_huigui.x + x) && o.y == (y_min_huigui.y + y);
                            }).length) {
                            huiguiFontTezheng += '1';
                        } else {
                            huiguiFontTezheng += '0';
                        }
                    }
                    huiguiFontTezheng += '\r\n';
                }
                //console.log(huiguiFontTezheng);
                finalFontsAllInfoHuigui.push(huiguiFontTezheng);//线性回归添加剂数组
                finalFontsAllInfoDirection.push(fontsAllInfo[i].wordDirectionStr);//方向字符串添加进数组
                // console.log('111', getHuigui(finalFontsSite));
            }
            callback(finalFontsAllInfo, finalFontsAllInfoHuigui, finalFontsAllInfoDirection, dataRstErZhiAll);
            // 分割取特征值
            // 从第一个点取特征值
            //fs.writeFileSync('test.txt', dataRst)
        } else {
            errCallback(err)
        }
    })
}
// getPicCode('./untitled1.png',function(data){
//     console.log(data)
// })
module.exports = getPicCode;
