
sprite-tool 自动生成雪碧图和对应图片的scss文件
===

### 简述

###### 1.以webpack-spritesmith为基础加工而成
###### 2.自动合成雪碧图
###### 3.支持2x，3x图同时引入,生成两份雪碧图
###### 4.isRetina为true时，图片格式例子：`example.png`(2x) `example@3x.png`(3x)
######   开启isRetina时，图片需要严格按上诉格式，否则无法生成



### npm安装

```
npm install sprite-tool  --save
```


### 使用方式
```
const spriteTool=require('sprite-tool')
let sprite = new spriteTool({
    iconPath:'src/image',      //目标路径 default：src/image
    targetPath:'src/sprite',  //生成路径 default：src/sprite
    name:'index'             //生成文件名  default：index
    isRetina:false          // 是否开启三倍图模式 default:false
})
sprite.run()
```

