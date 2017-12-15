import {Config} from 'Config.js'
import {instance as mm} from 'MapManager.js'
import {instance as rm} from 'ResourceManager.js'

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this._init();
    },

    _init:function(){
        this._preload();
    },
    
    _preload:function(){

        // TODO:Create State Manager

        // Create Puzzle Data object
        //mm.setMapData();

        //set background image
        this.m_pBackground = this.node.getChildByName("background");
        this.m_pBackground.width = rm.properties["safari.game.images.game.background.w"];
        this.m_pBackground.height = rm.properties["safari.game.images.game.background.h"];
        this.m_pBackgroundContent = this.m_pBackground.getComponent(cc.Sprite);
        this.m_pBackgroundContent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this.m_pBackgroundContent.spriteFrame = new cc.SpriteFrame(rm.images[rm.properties["safari.game.images.game.background.img"]]);

        // Create the Tile Overlay Images, used by PlayArea and MyTiles dialog

        // Create Game Board

        //init Effect Layer
        this.m_pEffectLayer = this.node.getChildByName("effectLayer");
        this.m_pEffectLayer.x = Config.Game_Area_X;
        this.m_pEffectLayer.y = Config.Game_Area_Y;
    },

    // update: function (dt) {

    // },
});
