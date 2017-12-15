var ns = require('staxNamingSpace');

var GameDataWriter = cc.Class({
    properties:{
        _data:{
        	default:{}
        }
    },
    
    setKey : function(value){
    	this._key = value;
    	return this;
    },

    write : function(data){
        throw "This Function is not implemented";
    },

    flush : function(){
        throw "this Function is not implemented";
    },
    
    
    statics : {
		get : function(key) {
			
			var GameWriter;
			if (ns.POGOSDK) {
				_GameWriter = require('saveslotswriter');
				cc.log("[SDK] using save slots w/r logic");
			} else {
				//Todo: remove localstorage
				_GameWriter = require('localstoragewriter');
				cc.log("[LOCAL] using local storage w/r logic");
			}

			return new _GameWriter().setKey(key);
		}
	}
});

module.exports = GameDataWriter;
