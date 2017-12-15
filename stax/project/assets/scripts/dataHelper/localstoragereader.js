var LOCAL_KEY_PREFIX = "local_key";

var LocalStorageReader = cc.Class({
    
    extends: require('gamedatareader'),

    read : function(){
		var that = this;
        return new Promise(function(resolve, reject){
            try{
                var result = cc.sys.localStorage.getItem(LOCAL_KEY_PREFIX + that._key);
                resolve(JSON.parse(result));
            }catch(error){
                reject(error);
            }
        });
    }
});

module.exports = LocalStorageReader;
