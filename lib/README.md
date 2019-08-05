
sprite-tool 自动生成雪碧图和对应图片的scss文件
===

#### 大部分loader和plugin可以把多张png或者svg打包成一张图片。这样做，图片体积往往会过大，所有页面的图片，都要等待这张被整合后的图片加载完以后才会出现。sprite-tool可以根据你的文件路径分配，帮你生成不同的雪碧图和scss文件。

### 简述

###### 1.以webpack-spritesmith为基础加工而成
###### 2.自动合成雪碧图
###### 3.支持2x，3x图同时引入,生成两份雪碧图
###### 4.isRetina为true时，图片名字格式例子：`example.png`(2x) `example@3x.png`(3x)
###### 5.开启isRetina时，图片名字需要严格按上述格式，否则无法生成。不开启isRetina时，图片名字不做要求。
###### 6.图片私自转换格式，比如jpg后缀格式修改为png，会导致无法生成雪碧图



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
    name:'index',             //生成文件名  default：index
    isRetina:false          // 是否开启三倍图模式 default:false
})
sprite.run()
```

### image文件路径
```
/
|-src
| |-image
| | |-detail
      |-example3.png
      |-example4.png
| | |-example1.png
| | |-example2.png
```

### sprite生成路径
```
/
|-src
| |-image
| | |-detail
      |-example3.png
      |-example4.png
| | |-example1.png
| | |-example2.png
  |-sprite
    |-detail
      |-index.png
      |-index.scss
    |-index.png
    |-index.scss
```