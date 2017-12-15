import {Config} from 'Config.js';

cc.Class({
    extends: cc.Component,

    properties: {
        tile:null,
        face:{
            default:null,
            type:cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    setTileData:function(td){
        this.tile = td;
    },

    setFace:function(){
        let faceNode = this.node.getChildByName('face');
        let sprite = faceNode.getComponent(cc.Sprite);
        let faceRow = Math.floor((this.tile.index - 1) / Config.Face_Cols);
        let faceCol = this.tile.index % Config.Face_Cols;
        console.log(faceCol);
        let frame = new cc.SpriteFrame(this.face.getTexture(), 
                    cc.rect(faceCol * Config.Face_W, faceRow * Config.Face_H,
                            Config.Face_W, Config.Face_H));
        sprite.spriteFrame = frame;
    },

    render:function(rows){
        if(this.node.parent){
            this.node.x = this.tile.col * Config.Tile_W;
            this.node.y = (rows - this.tile.row) * Config.Tile_H;
            this.setFace();
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
