import {instance as ResourceManager} from 'ResourceManager.js';
import {Config} from 'Config.js'

cc.Class({
    extends: cc.Component,

    properties: {
        tileVO:null,
        face:{
            default:null,
            type:cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {
        if(!this.flink){
            this.flink = [];
        }
        if(!this.normal){
            this.normal = null;
        }
    },

    addEventListener: function(type, callback){
        this.node.on(type, callback, this);
    },

    removeEventListener: function(type, callback){
        this.node.off(type, callback, this);
    },

    setVO: function(td){
        this.tileVO = td;
    },

    getVO:function(){
        return this.tileVO;
    },

    setPos: function(){
        this.node.x = this.tileVO.col * Config.Tile_Width;
        this.node.y = this.tileVO.row * Config.Tile_Height;
    },

    setFace: function(){
        let type = this.tileVO.type;
        let imgPrefix = "";
        switch (type) {
            case Config.TYPE_CHICKEN:
            imgPrefix = "stax.gm.staxChicken.";
            break;
            case Config.TYPE_COW:
            imgPrefix = "stax.gm.staxCow.";
            break;
            case Config.TYPE_DOG:
            imgPrefix = "stax.gm.staxDog.";
            break;
            case Config.TYPE_DUCK:
            imgPrefix = "stax.gm.staxDuck.";
            break;
            case Config.TYPE_PIG:
            imgPrefix = "stax.gm.staxPig.";
            break;
            case Config.TYPE_SHEEP:
            imgPrefix = "stax.gm.staxSheep.";
            break;
            default:
            cc.log("what this type for?", type);
            break;
        }
        this.normal = new cc.SpriteFrame(ResourceManager.getImages(imgPrefix + "normal"));
        this._setSpriteFrame(this.normal);
    },

    _setSpriteFrame: function(spriteFrame){
        let faceNode = this.node.getChildByName('face');
        let sprite = faceNode.getComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
