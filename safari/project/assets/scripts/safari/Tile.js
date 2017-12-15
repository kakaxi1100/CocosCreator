class Tile{
    constructor(){
        this.row = 0;
        this.col = 0;
        this.type = 0;
        this.index = 0;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.prev = null;
        this.prefab = null;
    }
}

export {Tile}
