let ocrcheckcode = require('../main')
const fs = require('fs');
ocrcheckcode.getRst(JSON.parse(fs.readFileSync(__dirname + '/jsonStudy.txt', 'utf8')), 
                    __dirname + '/temp.png', 
                    'http://****/',
                    'http://****/',
                    'http://****/',
                    function(code){
                        return {
                            pName: '**',
                            pCardNum: '***',
                            selectCourtId: 0,
                            pCode: code,
                            captchaId: '***',
                            searchCourtName: '***',
                            selectCourtArrange: 1,
                            currentPage: 1
                        }
                    }
                    ).then((data)=>{
                        console.log(data);
                    });