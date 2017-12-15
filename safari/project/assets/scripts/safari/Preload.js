import {instance as rm} from 'ResourceManager.js';
import {SpriteAnimation} from 'SpriteAnimation.js';

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad: function () {
        cc.loader.loadRes("data/gameInfo.json", this._jsonLoaderCompleted.bind(this));
    },

    _jsonLoaderCompleted:function(err, properties){
        if(err){
            cc.error(err.message || err);
            return;
        }
        rm.properties = properties;
        console.log("Propreties Loaded:", rm.properties);
        cc.loader.loadResDir("textures/test", cc.Texture2D, this._imagesLoaderCompleted.bind(this));
    },

    _imagesLoaderCompleted:function(err,images){
        if(err){
            cc.error(err.message || err);
            return;
        }
        images.forEach(function(element) {
            let index = element.url.lastIndexOf('/');
            let name = element.url.slice(index + 1);
            rm.images[name] = element;
            console.log("Propreties Loaded:", name, ":" , rm.images[name]);
        }, this);

        this._allLoaderCompleted();
    },

    _allLoaderCompleted:function(){
        cc.director.loadScene("safari");
        // this.test = new SpriteAnimation();
        // this.test.spriteFrames[0] = new cc.SpriteFrame(rm.images['tileflip_0_0.png']);
        // this.test.spriteFrames[1] = new cc.SpriteFrame(rm.images['tileflip_1_0.png']);
        // this.test.spriteFrames[2] = new cc.SpriteFrame(rm.images['tileflip_2_0.png']);
        // this.test.spriteFrames[3] = new cc.SpriteFrame(rm.images['tileflip_3_0.png']);
        // this.test.spriteFrames[4] = new cc.SpriteFrame(rm.images['tileflip_4_0.png']);
        // this.test.spriteFrames[5] = new cc.SpriteFrame(rm.images['tileflip_5_0.png']);
        // this.test.spriteFrames[6] = new cc.SpriteFrame(rm.images['tileflip_6_0.png']);
        // this.node.addChild(this.test.spriteNode);
        // this.test.play();
    },
    
    // update: function(dt){
    //     if(this.test){
    //         this.test.update(dt);
    //     }
    // }
});
