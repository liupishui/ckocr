let ocrcheckcode = require('../main')
const fs = require('fs');
ocrcheckcode.getRst(JSON.parse(fs.readFileSync(__dirname + '/jsonStudy.txt', 'utf8')), 
                    __dirname + '/temp.png', 
                    'http://zxgk.court.gov.cn/zhzxgk/captcha.do?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&random=0.7330692537629279',
                    'http://zxgk.court.gov.cn/zhzxgk/checkyzm?captchaId=bd2fd457ede44d26a018d71a2abf9fc7&pCode=',
                    'http://zxgk.court.gov.cn/zhzxgk/searchZhcx.do',
                    function(code){
                        return {
                            pName: '邵军',
                            pCardNum: '210104196007051212',
                            selectCourtId: 0,
                            pCode: code,
                            captchaId: 'bd2fd457ede44d26a018d71a2abf9fc7',
                            searchCourtName: '全国法院（包含地方各级法院）',
                            selectCourtArrange: 1,
                            currentPage: 1
                        }
                    }
                    ).then((data)=>{
                        console.log(data);
                    });