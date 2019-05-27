let ocrcheckcode = require('../main');
let fs = require('fs');
let DirectionArr = ocrcheckcode.erzhi2direction(__dirname +'/jsonStudy.txt');
for(let x in DirectionArr){
    console.log(x)
}
fs.writeFileSync(__dirname + '/jsonStudyDirection.txt', JSON.stringify(DirectionArr));
