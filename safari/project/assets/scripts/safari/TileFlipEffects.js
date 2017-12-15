import {instance as rm} from 'ResourceManager.js';
import {SpriteAnimation} from 'SpriteAnimation.js';
import {instance as em} from 'EventManager.js';
import {Config} from 'Config.js';

export class TileFlipEffects{
    constructor(){
        this.rightToLeft = new SpriteAnimation();
        this.reverseHalfLeft = new SpriteAnimation();
        this.currentEffect = this.reverseHalfLeft;
        this.setRightToLeft();
        this.setReverseHalfLeft();
        this.row = 0;
        this.col = 0;
        this.from = new cc.Vec2();
        this.to = new cc.Vec2();
        // this.curTime = 0;
        this.isMoving = false;
        this.speedX = this.speedY = 3;
        this.step = 0;
    }

    init(){
        this.from.x = this.from.y = 0;
        this.to.x = this.to.y = 0;
        // this.curTime = 0;
        this.isMoving = false;
        this.speedX = this.speedY = 3;
        this.row = this.col = 0;
    }

    setPos(fx, fy, tx, ty){
        this.isMoving = true;
        this.currentEffect.spriteNode.x = fx;
        this.currentEffect.spriteNode.y = fy;
        this.from.x = fx;
        this.from.y = fy;
        this.to.x = tx;
        this.to.y = ty;
        this.caculateSpeed();
    }

    caculateSpeed(){
        let dx = this.to.x - this.from.x;
        let dy = this.to.y - this.from.y;
        let step = 0;

        if(Math.abs(dy) > Math.abs(dx)){
            step = dy / this.speedY;
        }else{
            step = dx / this.speedX;
        }
        this.step = Math.floor(Math.abs(step));
        this.speedY = dy / this.step;
        this.speedX = dx / this.step;
    }

    setRightToLeft(){
        this.rightToLeft.spriteFrames[0] = new cc.SpriteFrame(rm.images['tileflip_0_0.png']);
        this.rightToLeft.spriteFrames[1] = new cc.SpriteFrame(rm.images['tileflip_1_0.png']);
        this.rightToLeft.spriteFrames[2] = new cc.SpriteFrame(rm.images['tileflip_2_0.png']);
        this.rightToLeft.spriteFrames[3] = new cc.SpriteFrame(rm.images['tileflip_3_0.png']);
        this.rightToLeft.spriteFrames[4] = new cc.SpriteFrame(rm.images['tileflip_4_0.png']);
        this.rightToLeft.spriteFrames[5] = new cc.SpriteFrame(rm.images['tileflip_5_0.png']);
        this.rightToLeft.spriteFrames[6] = new cc.SpriteFrame(rm.images['tileflip_6_0.png']);
    }

    setReverseHalfLeft(){
        this.reverseHalfLeft.spriteFrames[0] = new cc.SpriteFrame(rm.images['tileflip_3_0.png']);
        this.reverseHalfLeft.spriteFrames[1] = new cc.SpriteFrame(rm.images['tileflip_2_0.png']);
        this.reverseHalfLeft.spriteFrames[2] = new cc.SpriteFrame(rm.images['tileflip_1_0.png']);
        this.reverseHalfLeft.spriteFrames[3] = new cc.SpriteFrame(rm.images['tileflip_0_0.png']);
    }

    update(dt){
        this.currentEffect.update(dt);
        if(this.isMoving == false) return;
        // if(this.curTime > 1){
        //     this.curTime = 1;
        //     this.isMoving = false;
        //     em.eventTarget.emit(Config.EventType.TileFlipOver, this);
        // }
        // this.currentEffect.spriteNode.x = this.from.x + this.curTime * (this.to.x - this.from.x);
        // this.currentEffect.spriteNode.y = this.from.y + this.curTime * (this.to.y - this.from.y);
        // this.curTime += dt;
        
        if(this.step < 1){
            this.isMoving = false;
            em.eventTarget.emit(Config.EventType.TileFlipOver, this);
            return;
        }

        this.currentEffect.spriteNode.x += this.speedX;
        this.currentEffect.spriteNode.y += this.speedY;
        this.step--;
    }
}