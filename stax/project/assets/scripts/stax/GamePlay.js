import {instance as TilesManager} from 'TilesManager.js';
import {Config} from "Config.js"

cc.Class({
    extends: cc.Component,

    properties: {
        tile_Prefab: {
            default: null,
            type: cc.Prefab
        }, 
    },

    // use this for initialization
    onLoad: function () {
        this.node.x += Config.GamePlay_OffsetX;
        this.node.y += Config.GamePlay_OffsetY;

        TilesManager.setViewParameter(this.tile_Prefab, this.node);
        this.init();

        // this.node.on(cc.Node.EventType.MOUSE_DOWN, function(event){
        //     cc.log("hello");
        // }, this);
    },

    init: function(){
        //1.创建所有的tile, 让tile先不要显示
        //2.tile运动到指定的位置
        TilesManager.init();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
