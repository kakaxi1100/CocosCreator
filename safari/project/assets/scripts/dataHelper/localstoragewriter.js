var LOCAL_KEY_PREFIX = "local_key";

var LocalStorageWriter = cc.Class({

    extends: require('gamedatawriter'),

    write : function(data){
        // clone data, deep copy
        this._data = cc.js.mixin({}, data);
    },

    flush : function(){
        var databuffer = JSON.stringify(this._data);
        cc.sys.localStorage.setItem(LOCAL_KEY_PREFIX + this._key, databuffer);
    }
});

module.exports = LocalStorageWriter;
