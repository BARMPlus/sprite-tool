/* 自动生成Sprite，禁止放入webpack-plugin，避免每次打包需重新生成 */

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const SpritesMithPlugin = require('webpack-spritesmith')
const compiler = webpack({})

function resolve (...dir) {
    return path.join(process.cwd(), ...dir)
}

class CreateSprite {
    constructor (options={}) {
        this.sprites = []
        this.retina = 3 // isRetina为true时，使用的参数.不许修改
        this.fontSize = 75 // 默认以75px为根节点字体.不许修改
        this.isRem=options.isRem!==undefined?options.isRem:false //是否开启rem
        this.isRetina = options.isRetina||false //为true时，开启3倍图模式，3倍图模式下必须带@3x后缀，否则sprite无法生成
        this.iconPath = options.iconPath||'src/image'
        this.targetPath =options.targetPath|| 'src/sprite'
        this.name = options.name||'index'
        this.imageRef = this.imageRefFn(this.targetPath)
        this.templateFunctionRetina = this.templateFunctionRetina.bind(this)
    }

    imageRefFn (targetPath) {
        let splitArr = targetPath.split('/')
        let name = ''
        splitArr.forEach((path, index) => {
            if (index === 0) return
            name += `${path}/`
        })
        return '~' + name
    }

    createPrefix (image, retina) {
        let getDefine = image.slice(this.imageRef.length).split('/')
        getDefine.pop()
        let prefix = getDefine.join('-')
        return `sprite${retina && retina !== 1 ? retina + 'x' : ''}${prefix ? '-' : ''}${prefix}`
    }

    templateFunctionRetina (data) {
        if (!data.sprites[0]) return
        let val = this.retinaTemplate(data)
        let { isRetina, retina } = this
        if (isRetina)val += '\n' + this.retinaTemplate(data, retina)
        return val
    }

    sizeAndUnitChange(size){
        let { fontSize,isRem } = this
        if(!isRem)return size+'px'
        return size/fontSize+'rem'
    }

    retinaTemplate (data, retina) {
        let sizeAndUnitChange=this.sizeAndUnitChange.bind(this)
        let prefix = this.createPrefix(data.sprites[0].image, retina)
        let { image, total_width, total_height } = data.sprites[0]
        image = (retina) ? image.replace(/.png/, `@${retina}x.png`) : image
        let perNames = []
        let shared = `.${prefix} { background-image: url(I);background-size:X Y}`
            .replace('I', image)
            .replace('X', sizeAndUnitChange(total_width))
            .replace('Y', sizeAndUnitChange(total_height))
        let perSprite = data.sprites.map((sprite) => {
            const name = sprite.name.replace(/@|\.|_/g, '-')
            if (retina) perNames.push(name) // retina存在时，则会用到
            return `.${prefix}-N {display:inline-block; width: W; height: H; background-position: X Y;@extend .${prefix} }`
                .replace('N', name)
                .replace('W', sizeAndUnitChange(sprite.width))
                .replace('H', sizeAndUnitChange(sprite.height))
                .replace('X', sizeAndUnitChange(sprite.offset_x))
                .replace('Y', sizeAndUnitChange(sprite.offset_y))
        }).join('\n')
        let mixin = ''
        if (retina) {  //retina存在时，启用mixin
            let prefix = this.createPrefix(data.sprites[0].image)
            perNames.forEach(name => {
                mixin += '\n' +`@mixin ${name}(){
        @extend .${`${prefix}-${name}`};
        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
             background-image: url(${image});
            }
          }`
            })
        }
        return shared + '\n' + perSprite+ '\n' + mixin
    }

    makeSprite (dPath = '') {
        let { targetPath, iconPath, imageRef, name, isRetina, retina, templateFunctionRetina } = this
        let variable = {
            src: {
                cwd: resolve(iconPath, dPath),
                glob: '*'
            },
            target: {
                image: resolve(targetPath, dPath, `${name}.png`),
                css: [
                    [resolve(targetPath, dPath, `${name}.scss`), {
                        format: 'function_based_template'
                    }]
                ]
            },
            apiOptions: {
                cssImageRef: dPath ? `${imageRef + dPath}/${name}.png` : `${imageRef + name}.png`
            },
            customTemplates: {
                function_based_template: templateFunctionRetina,
                function_based_template_retina: templateFunctionRetina
            },
            retina: `@${retina}x`,
            spritesmithOptions: {
                algorithm: 'top-down',
                padding: 20
            }
        }
        if (!isRetina) delete variable.retina
        return new SpritesMithPlugin(variable)
    }

    isRootDirectory (initFileName) {
        let filePath = resolve(this.iconPath)
        let imageArr=fs.readdirSync(filePath).filter(image=>{
            return /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(image)
        })
        if(imageArr.length===0)return
        if (initFileName === '' && fs.lstatSync(filePath).isDirectory()) compiler.apply(this.makeSprite())
    }

    each (dir, initFileName = '') {
        const files = fs.readdirSync(dir)
        this.isRootDirectory(initFileName)
        let { sprites } = this
        files.forEach((file) => {
            let filePath = path.join(dir, file)
            if (fs.lstatSync(filePath).isDirectory()) {
                sprites.push(this.makeSprite(initFileName + file))
                this.each(filePath, `${file}/`)
            }
        })
    }

    createSprite () {
        let { iconPath } = this
        let publicPath = resolve(iconPath)
        this.each(publicPath)
    }

    run () {
        let { sprites } = this
        this.createSprite()
        sprites.forEach((fn) => {
            compiler.apply(fn)
        })
        compiler.run()
    }
}

module.exports=CreateSprite
