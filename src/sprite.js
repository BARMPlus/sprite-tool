const spriteTool=require('../bin')

let sprite = new spriteTool({
    iconPath:'src/image',      //目标路径
    targetPath:'src/sprite',  //生成路径
    name:'index',  //生成文件名
    isRetina:false
})
sprite.run()