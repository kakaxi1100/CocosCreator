class EventManager{
    constructor(){
        this.eventTarget = new cc.EventTarget();
    }
}

let instance = new EventManager();

export {instance}