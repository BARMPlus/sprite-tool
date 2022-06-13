const spriteTool = require('../lib')

let sprite = new spriteTool({
  iconPath: 'src/image',      //目标路径
  targetPath: 'src/sprite',  //生成路径
  name: 'index',  //生成文件名
  isRetina: false,  //是否开启三倍图模式
  isRem: true,   //是否使用rem
})
sprite.run()
