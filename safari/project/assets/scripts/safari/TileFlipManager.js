import {TileFlipEffects} from 'TileFlipEffects.js';
import {instance as mm} from 'MapManager.js';
import {Config} from 'Config.js';
import {instance as em} from 'EventManager.js';

class TileFlipManager{
    constructor(){
        this.effects = [];
        this.curUsed = [];
        this.effectsParent = null;
        em.eventTarget.on(Config.EventType.TileFlipOver, this.tileFilpOer.bind(this));
    }

    tileFilpOer(event){
        this.returnTile(event.detail);
    }

    createTileFlipEffects(){
        let newTilesNum = mm.curMapData.totalTiles - this.effects.length;
        if(newTilesNum <= 0) return;
        for(let i = 0; i < newTilesNum; ++i){
            this.effects.push(new TileFlipEffects());
        }
    }

    setFromAndDest(){
        for(let i = 0; i < mm.curMapData.rows; ++i){
            for(let j = 0; j < mm.curMapData.cols; ++j){
                if(mm.curMapData.rawMap[i][j]  >= 1){
                    let tileEffect = this.effects.pop();
                    tileEffect.setPos(0, 500, j * Config.Tile_W, (mm.curMapData.rows -i) * Config.Tile_H);
                    tileEffect.row = j;
                    tileEffect.col = i;
                    // tileEffect.isMoving = true;
                    // tileEffect.from.x = 0;
                    // tileEffect.from.y = 0;
                    // tileEffect.to.x = j * Config.Tile_W;
                    // tileEffect.to.y = (mm.curMapData.rows -i) * Config.Tile_H;
                    // tileEffect.caculateSpeed();
                    this.curUsed.push(tileEffect);
                }
            }

        }
    }

    returnTile(effect){
        for(let i = 0; i < this.curUsed.length; ++i){
            if(this.curUsed[i] == effect){
                let tileEffect = this.curUsed.splice(i, 1)[0];
                // if(this.effectsParent != null){
                //     this.effectsParent.removeChild(tileEffect.currentEffect.spriteNode);
                // }
                em.eventTarget.emit("a", {'row':tileEffect.row, 'col':tileEffect.col});
                tileEffect.currentEffect.spriteNode.removeFromParent();
                tileEffect.init();
                this.effects.push(tileEffect);
                break;
            }
        }
    }

    addTilesToParent(node){
        this.effectsParent = node;
        this.curUsed.forEach(function(element){
            node.addChild(element.currentEffect.spriteNode);
            element.currentEffect.play();
        }, this);
    }

    update(dt){
        this.curUsed.forEach(function(element) {
            element.update(dt);
        }, this);
    }
}

export let instance = new TileFlipManager();