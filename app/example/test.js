let getPixels = require('get-pixels');
let fs = require('fs');
// let data = fs.readFileSync(`${__dirname}/1.jpg`);
// console.log(data);
getPixels(__dirname+'/secret/6.jpg',(err,pixelsArr)=>{
    console.log(pixelsArr);
})