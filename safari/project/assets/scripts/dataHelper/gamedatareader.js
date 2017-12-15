var ns = require('safariNamingSpace');

var GameDataReader = cc.Class({
	properties : {
		_data : {
			default:{}
		},
		_key : Number
	},

	setKey : function(value) {
		this._key = value;
		return this;
	},

	read : function() {
		throw "this Function is not implemented";
	},

	statics : {
		get : function(key) {
			var _GameReader;
			if (ns.POGOSDK) {
				_GameReader = require('saveslotsreader');
				cc.log("[SDK] using save slots w/r logic");
			} else {
				//Todo: remove localstorage
				_GameReader = require('localstoragereader');
				cc.log("[LOCAL] using local storage w/r logic");
			}

			return new _GameReader().setKey(key);
		}
	}
});

module.exports = GameDataReader; 
