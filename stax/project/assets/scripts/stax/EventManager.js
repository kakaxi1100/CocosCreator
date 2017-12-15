class EventManager{
    constructor(){
        this.eventTarget = new cc.EventTarget();
    }
}

let instance = (function(){
                    let instance = new EventManager();
                    instance.EVENT_TYPE_TEST = "EVENT_TYPE_TEST";

                    return instance;
                })();

export {instance}