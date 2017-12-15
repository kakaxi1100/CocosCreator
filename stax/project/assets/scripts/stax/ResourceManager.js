class ResourceManager{
    constructor(){
        this.properties = {};
        this.images = {};
    }

    setProperties(key, value){
        if(this.properties[key] != null){
            cc.log(key, "already used! will rewrite the value", this.properties[key], value);
        }
        this.properties[key] = value;
    }

    getProperties(key){
        return this.properties[key];
    };

    getImages(key){
        return this.images[this.getProperties(key)];
    };
}

let instance  = new ResourceManager();
 
export {instance};