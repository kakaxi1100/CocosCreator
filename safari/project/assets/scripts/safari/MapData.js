import {Tile} from 'Tile.js';
import {Config} from 'Config.js';
import {instance as rm} from 'ResourceManager.js';

class MapData{
    constructor(){
        this.rawMap = [];
        this.realMap = [];
        this.rows = 0;
        this.cols = 0;
        this.totalTiles = 0;
    }

    createRawMap(puzzleIndex){
        let level = "puz.test." + puzzleIndex;
        let puzzle = rm.properties[level];
        for(let row = 1; puzzle[row] != null;  ++row){
            let rStr = puzzle[row];
            this.rawMap[row - 1] = [];
            for(let col = 0; col < rStr.length; ++col){
                this.rawMap[row - 1][col] = rStr[col]; 
                if(rStr[col] > 0){
                    ++this.totalTiles;
                }
            }
        }
    }

    parseMap(){
        if(this.rawMap == null) return;
        
        this.rows = this.rawMap.length;
        this.cols = this.rawMap[0].length;

        let i, j;
        let tileIndex = [];
        let tile = null;

        //convert number tiles to data tiles 
        for(i = 0; i < this.rows; i++){
            this.realMap[i] = [];
            for(j = 0; j < this.cols; j++){
                tile = new Tile();
                tile.col = j;
                tile.row = i;
                if(this.rawMap[i][j] == Config.Tile_Empty){
                    tile.type = 0;
                }else if(this.rawMap[i][j] >= Config.Tile_Normal){
                    tile.type = 1;
                }
                this.realMap[i][j] = tile;
                tileIndex.push(i*this.cols + j);
            }
        }

        //shuffle
        while(tileIndex.length > 0){
           let rand, inr, ind, r, c;
           let tileN = null; 
           inr = Math.floor(Math.random() * Config.NormalTileTotal) + 1;
           //first tile
           rand = Math.floor(Math.random() * tileIndex.length);
           ind = tileIndex.splice(rand, 1);
           r = Math.floor(ind / this.cols);
           c = ind % this.cols;
           tileN = this.realMap[r][c];
           tileN.index = inr;
           //second tile
           rand = Math.floor(Math.random() * tileIndex.length);
           ind = tileIndex.splice(rand, 1);
           r = Math.floor(ind / this.cols);
           c = ind % this.cols;
           tileN = this.realMap[r][c];
           tileN.index = inr;
        }
    }

    getTileByXY(x, y){
        let c = Math.floor(x / Config.Tile_W);
        let r = Math.floor(y / Config.Tile_H);
        if(c >=0 && c < this.cols && r >= 0 && r < this.rows){
            return this.realMap[r][c];
        }
        return null;
    }
}

export {MapData};