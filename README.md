
sprite-tool 自动生成雪碧图和对应图片的scss文件
===

### 简述

###### 1.以webpack-spritesmith为基础加工而成
###### 2.自动合成雪碧图
###### 3.支持2x，3x图同时引入



### npm安装

```
npm install sprite-tool  --save
```


### 使用方式
```
const spriteTool=require('sprite-tool')
let sprite = new spriteTool({
    iconPath:'src/image',      //目标路径
    targetPath:'src/sprite',  //生成路径
    name:'index'  //生成文件名
})
sprite.run()
```

