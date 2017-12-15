// let listener = {
//     event: cc.EventListener.TOUCH_ONE_BY_ONE,
//     onTouchBegan: function (touch, event) {
//         let newVec = _self.node.convertToNodeSpace(touch.getLocation());
//         let td = mm.curMapData.getTileByXY(newVec.x, newVec.y);
//         if(td != null && td.type != Config.Tile_Empty){
//             td.prefab.getComponent('TileView').tileInfo.string = td.col + ',' + td.row;
//         }
//         cc.log(newVec);
//         return true; 
//     },
//     onTouchMoved: function (touch, event) {
//     },
//     onTouchEnded: function (touch, event) {
//     },
//     onTouchCancelled: function (touch, event) {
//     }
// };

// cc.eventManager.addListener(listener, this.node);
import {instance as mm} from 'MapManager.js';
import {Config} from 'Config.js';
import {instance as em} from 'EventManager.js';

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
        //1. choose a map
        mm.setMapData();
        mm.iniData(1, this.node);
        //2. layout
        this.render();
        em.eventTarget.on("a", this.showTilesOneByOne.bind(this));
        //3. add touch event listener

    },

    showTilesOneByOne:function(event){
        let realMap = mm.curMapData.realMap;
        this.node.addChild(realMap[event.detail.row][event.detail.col].prefab);
    },

    render:function(){
        //fill the tiles
        let i, j;
        let tv, td;
        let realMap = mm.curMapData.realMap;

        for(i = 0; i < realMap.length; i++){
            for( j = 0; j < realMap[0].length; j++){ 
                tv = cc.instantiate(this.tile_Prefab);
                td = realMap[i][j];
                tv.getComponent('TileView').setTileData(td);
                td.prefab = tv;
                if(td.type != 0){
                    // this.node.addChild(tv);
                    tv.getComponent('TileView').render(mm.curMapData.rows);
                }
            }
        }

        //adjuest layout pos
        this.node.x = Config.Game_Area_X;
        this.node.y = Config.Game_Area_Y;
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
