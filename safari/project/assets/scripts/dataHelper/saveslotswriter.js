var ns = require('safariNamingSpace');

var SaveSlotsWriter = cc.Class({

    extends:require('gamedatawriter'),

    ctor: function(){
    },

    write : function(data){
        // clone data, deep copy
        this._data = cc.js.mixin({}, data);
    },

    flush : function(){
        var databuffer = JSON.stringify(this._data);
        ns.pogoSDK.sendSaveData(this._key, databuffer).catch(this.saveDataError.bind(this));
    },

    saveDataError : function(error){
        ns.pogoSDK.logError("An error occurred in saving slot data.", "saveslotswriter.js", 22, 9, error);
        ns.pogoSDK.logEvent("error modal", "saving slot data");
    }
});

module.exports = SaveSlotsWriter;
