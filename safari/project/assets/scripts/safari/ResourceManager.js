class ResourceManager{
    constructor(){
        this.properties = {};
        this.images = {};
    }
}

let instance = new ResourceManager();

export {instance};