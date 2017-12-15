var ns = require('staxNamingSpace');

var SaveSlotsReader = cc.Class({

    extends : require('gamedatareader'),

    ctor: function(){
    },

    read : function(){
        var that = this;
        return ns.POGOSDK.getSaveData(that._key).then(function(result){
            if(result && result !== ""){
                return JSON.parse(result);
            }
            return null;
        }).catch(this.readDataError.bind(this));
    },

    readDataError : function(error){
        ns.POGOSDK.logError("An error occurred in reading slots data.", "saveslotsreader.js", 15, 9, error);
        ns.POGOSDK.logEvent("error modal", "reading save slots data");
    }
});

module.exports = SaveSlotsReader;
