import {MapData} from 'MapData.js';
import {Config} from 'Config.js'

class MapManager{
    constructor(){
        this.curMapData = null;
        this.preMapData = null;
        this.firstTile = null;
        this.secondTile = null;
        this.node = null;
    }

    setMapData(){
        if(this.curMapData != null){
            this.preMapData = this.curMapData;
        }
        this.curMapData = new MapData();
    }

    iniData(index, node){
        this.curMapData.createRawMap(index);
        this.curMapData.parseMap();
        this.node = node;
    }

    // addEventListener(){
    //     let self = this;
    //     let mouseListener = {
    //         event: cc.EventListener.MOUSE,
    //         onMouseDown: function (event) {
    //             let newVec = self.node.convertToNodeSpace(event.getLocation());
    //             let td = self.curMapData.getTileByXY(newVec.x, newVec.y);
    //             if(td != null && td.type != Config.Tile_Empty){
    //                 td.prefab.getComponent('TileView').tileInfo.string = td.col + ',' + td.row;
    //                 if(this.firstTile == null){
    //                     this.firstTile = td;
    //                 }else{
    //                     if(this.secondTile == null){
    //                         this.secondTile = td;

    //                     }
    //                 }
    //             }
    //         },

    //         onMouseUp: function (event) {
               
    //         },

    //         onMouseMove: function (event) {
               
    //         }
    //     }

    //     cc.eventManager.addListener(mouseListener, this.node);
    // }
}

export let instance = new MapManager();