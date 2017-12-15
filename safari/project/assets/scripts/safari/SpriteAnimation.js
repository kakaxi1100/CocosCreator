export class SpriteAnimation{
    constructor(){
        this.spriteNode = new cc.Node();
        this.sprite = this.spriteNode.addComponent(cc.Sprite);
        this.spriteFrames = [];
        this.curIndex = 0;
        this.loop = false;
        this.isPlaying = false;
        this.duration = 0.2;
        this.curDuration = this.duration;
        this.setSize();
    }

    setSize(){
        this.spriteNode.width = 44;
        this.spriteNode.height = 60;
        this.sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM; 
    }

    play(){
        this.isPlaying = true;
    }

    stop(){
        this.isPlaying = false;
    }

    gotoAndPlay(index){
        if(index >= spriteFrames){
            index = 0;
        }
        this.curIndex = index;
        this.isPlaying = true;
    }

    gotoAndStop(index){
        if(index >= spriteFrames){
            index = 0;
        }
        this.curIndex = index;
        this.isPlaying = false;
    }

    update(dt){
        if(this.isPlaying == false) return;
        if(this.curIndex >= this.spriteFrames.length){
            this.curIndex = 0;
            if(this.loop == false){
                this.isPlaying = false;
            }
        }
        if(this.curDuration >= this.duration){
            this.sprite.spriteFrame = this.spriteFrames[this.curIndex++];
            this.curDuration = 0;
        }
        this.curDuration += dt;
    }
}