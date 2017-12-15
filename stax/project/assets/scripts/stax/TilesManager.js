import {TileVO} from 'TileVO.js';
import {Config} from 'Config.js'

class TilesManager{
    constructor(){
        this.grids = null;
        this.tile_prefab = null;
        this.parentNode = null;
        this.matchList = [];
        this.typeList = [];
        this.colList = [];
        this.rowMax = null;
        this.colMax = null;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.dx = 0;
        this.dy = 0;
        this.seletedTile = null;
        this.moveTiles = [];
        this.stateMovig = false;
        this.stateFlashBack = false;
    }

    setViewParameter(prefab, parentNode){
        this.tile_prefab = prefab;
        this.parentNode = parentNode;
    }

    init(){
        this._preCreatTiles();
        this._creatTiles();
        this._renderTiles();
        this._addEventListener();
    }

    update(dt){
        if(this.stateMovig){
            this._moveTiles();
        }else if(this.stateFlashBack){
            this._flashBack();
        }
    }

    _preCreatTiles(){
        let i;
        let leftTiles = Config.Total_Tiles - Config.MinRow * Config.COLS;
        this.colType = [0,1,2,3,4,5,6,7,8,9];
        this.colList = [Config.MinRow,Config.MinRow,Config.MinRow,Config.MinRow,Config.MinRow,
                        Config.MinRow,Config.MinRow,Config.MinRow,Config.MinRow,Config.MinRow];

        for (i =0; i < leftTiles; i++) {
            let index = Math.floor(Math.random() * this.colType.length);
            let colNum = this.colType[index];
            this.colList[colNum]++;
            if(this.colList[colNum] >= Config.MaxRow){
                this.colType.splice(index, 1);
            }
        }
        cc.log("Every Col Num:", this.colList);
        
        for(i = 0; i < this.colList.length; i++){
            let rowNum = this.colList[i];
            if(rowNum > this.rowMax){
                this.rowMax = rowNum;
            }
        }
        this.colMax = this.colList.length;

        this.grids = [];
        for(i = 0; i < this.rowMax; ++i){
            this.grids[i] = [];
        }

        this.typeList = [1,2];
    }

    _creatTiles(){
        let i, j;
        let td, tv;
        let type;
        let checkTypeList = [];
        //col first
        for(j = 0; j < this.colList.length; j++){
            //row second
            for(i = 0; i < this.colList[j]; i++){
                type = Math.floor(Math.random()*Config.Total_TYPES) + 1;
                td = new TileVO();
                td.row = i;
                td.col = j;
                td.type = type;

                //检查重复type
                let needReBuildCol = false;
                checkTypeList.push(td.type);
                td.isMatch = true;
                this._doMatch(td);
                //判断列是否所有的tile都不行,如果是就重新构造此列
                while(this.matchList.length >= Config.Min_Chain){
                    td.type = this._retypeExcpetType(checkTypeList);//排除所有检测过的type
                    if(td.type == null){//当所有type都检测过了,还是不能满足小于5连, 那么手动build此列
                        needReBuildCol = true;
                        break;
                    }

                    checkTypeList.push(td.type);

                    this._resetMatchList();
                    td.isMatch = true;
                    this._doMatch(td);
                }
                this._resetMatchList();
                cc.log("checkTypeList", checkTypeList);
                while(checkTypeList.length > 0){
                    checkTypeList.pop();
                }

                if(needReBuildCol){
                    this._buildColByManual(j);
                    break;
                }

                this.grids[i][j] = td;
            }
        }

    }

    _renderTiles(){
        let tv, td;
        for(let i = 0; i < this.grids.length; i++){
            for(let j = 0; j < this.grids[i].length; j++){
                td = this.grids[i][j];
                if(!td){
                    continue;
                }
                tv = cc.instantiate(this.tile_prefab);
                td.prefab = tv;
                this.parentNode.addChild(tv);
                tv.getComponent('TileView').setVO(td);
                tv.getComponent('TileView').setFace();
                tv.getComponent('TileView').setPos();   
            }
        }
    }

    _addEventListener(){
        this.parentNode.on(cc.Node.EventType.MOUSE_DOWN, this._onTileMouseDown.bind(this));
        this.parentNode.on(cc.Node.EventType.MOUSE_MOVE, this._onTileMouseMove.bind(this));
        this.parentNode.on(cc.Node.EventType.MOUSE_UP, this._onTileMouseUp.bind(this));
    }

    _removeEventListener(){
        this.parentNode.off(cc.Node.EventType.MOUSE_DOWN, this._onTileMouseDown.bind(this));
        this.parentNode.off(cc.Node.EventType.MOUSE_MOVE, this._onTileMouseMove.bind(this));
        this.parentNode.off(cc.Node.EventType.MOUSE_UP, this._onTileMouseUp.bind(this));
    }

    _getTileByPos(pos){
        let row = Math.floor(pos.y / Config.Tile_Height);
        let col = Math.floor(pos.x / Config.Tile_Width);
        cc.log("_getTileByPos", row, col);
        if(row < 0 || row >= this.rowMax || col < 0 || col >= this.colMax){
            return null;
        }

        return this._getTile(row, col);
    }

    _onTileMouseDown(event){
        let nodeSpacePos = event.target.convertToNodeSpace(cc.v2(event.getLocationX(), event.getLocationY())); 
        cc.log("_onTileMouseDown", nodeSpacePos);
        let td = this._getTileByPos(nodeSpacePos);
        if(td == null) return;
        this.seletedTile = td;
        let row = this.seletedTile.row;

        do{
            td = this._getTile(row, this.seletedTile.col);
            if(td == null) break;
            this.moveTiles.push(td);
            row++;
        }while(td != null)
        
        //计算它之上的其它tiles, 之后要跟着一起移动
        this.mouseOffsetX = event.getLocationX();
        this.mouseOffsetY = event.getLocationY();

        cc.log("MouseDown", this.mouseOffsetX, this.mouseOffsetY);
        this.stateMovig = true;
    }

    _onTileMouseMove(event){
        if(this.seletedTile == null) return;
        this.dx = event.getLocationX() - this.mouseOffsetX;
        this.dy = event.getLocationY() - this.mouseOffsetY;
        cc.log("MouseMove", event.getLocationX(), event.getLocationY(), this.mouseOffsetX, this.mouseOffsetY);
        this.mouseOffsetX = event.getLocationX();
        this.mouseOffsetY = event.getLocationY();
        //cc.log("MouseMove", dx, dy);
    }
    
    _moveTiles(){
        for(let i = 0; i < this.moveTiles.length; i++){
            this.moveTiles[i].prefab.x += this.dx;
            this.moveTiles[i].prefab.y += this.dy;
        }
        this.dx = this.dy = 0;
    }

    _flashBack(){
        for(let i = 0; i < this.moveTiles.length; i++){

        }
    }

    _onTileMouseUp(event){
        if(this.seletedTile){

            while(this.moveTiles.length > 0){
                let tile = this.moveTiles.pop();
            }
            this.seletedTile = null;
        }
    }

    _buildColByManual(col){
        cc.log('_buildColByManual', col);
        for(i = 0; i < this.colList[col]; i++){
            let tempTile = this._getTile(i, col - 1);
            let type;
            if(tempTile){
                type = this._retypeExcpetType([tempTile.type]);
            }else{
                type = Math.floor(Math.random()*Config.Total_TYPES) + 1;
            }
            let td = new TileVO();
            td.row = i;
            td.col = col;
            td.type = type;

            this.grids[i][col] = td;
        }
    }

    _retypeExcpetType(types){
        let temList = [];
        let needPush;
        for(let i = 0; i < this.typeList.length; i++){
            needPush = true;
            let temType = this.typeList[i];
            for(let j = 0; j < types.length; j++){
                if( temType == types[j]){
                    needPush = false;
                    break;
                }
            }
            if(needPush){
                temList.push(temType);
            }
        }
        let index = Math.floor(Math.random()*temList.length);
        return temList[index];
    }

    _resetMatchList(){
        while(this.matchList.length > 0){
            let tile = this.matchList.pop();
            tile.isMatch = false;
        }
    }

    _doMatch(tile){
        this.matchList.push(tile);
        this._foundUp(tile);
        this._foundDown(tile);
        this._foundLeft(tile);
        this._foundRight(tile);
    }

    _foundUp(tile){
        let tempRow = tile.row + 1;
        let upTile;
        if(tempRow >= this.rowMax){
            return;
        }
        upTile = this._getTile(tempRow, tile.col);
        if(upTile == null || upTile.isMatch == true || upTile.type != tile.type){
            return;
        }else{
            upTile.isMatch = true;
            this._doMatch(upTile);
        }
    }

    _foundDown(tile){
        let tempRow = tile.row - 1;
        let downTile;
        if(tempRow < 0){
            return;
        }
        downTile = this._getTile(tempRow, tile.col);
        if(downTile == null || downTile.isMatch == true || downTile.type != tile.type){
            return;
        }else{
            downTile.isMatch = true;
            this._doMatch(downTile);
        }
    }

    _foundLeft(tile){
        let tempCol = tile.col - 1;
        let leftTile;
        if(tempCol < 0){
            return;
        }
        leftTile = this._getTile(tile.row, tempCol);
        if(leftTile == null || leftTile.isMatch == true || leftTile.type != tile.type){
            return;
        }else{
            leftTile.isMatch = true;
            this._doMatch(leftTile);
        }
    }

    _foundRight(tile){
        let tempCol = tile.col + 1;
        let rightTile;
        if(tempCol >= this.colMax){
            return;
        }
        rightTile = this._getTile(tile.row, tempCol);
        if(rightTile == null|| rightTile.isMatch == true || rightTile.type != tile.type){
            return;
        }else{
            rightTile.isMatch = true;
            this._doMatch(rightTile);
        }
    }

    _getTile(row, col){
        if(row < 0 || row >= this.rowMax || col < 0 || col >= this.colMax){
            return null;
        }
        return this.grids[row][col];
    }
}

let instance = new TilesManager();

export {instance};