# ckocr
### Install

Install with npm:
```
npm install ckocr --save
```

### Example

```js
const ckocr = require('ckocr')
```
#### 获取图片特征
```js
ckocr.getPicCode(__dirname + '/foo.png',function(finalFontsAllInfo, finalFontsAllInfoHuigui, finalFontsAllInfoDirection, dataRstErZhiAll){
    // finalFontsAllInfo 图片中所有的二值化连续数组
    // finalFontsAllInfoHuigui 图片中所有的二值化并进行线性回归后的数组
    // finalFontsAllInfoDirection 图片中所有字体连续性信息
    // dataRstErZhiAll 图片的二值化信息
})
```

#### 从图片特征集合找到符合特征的字母

```js
ckocr.getPicCode(__dirname + '/jsonStudy.txt',__dirname + '/foo.png').then((wordArr)=>{
    // wordArr 找到的符合特征的字母集合
})
```

jsonStudy.txt是通过getPicCode收集到的（app/example/index.js是个例子）
