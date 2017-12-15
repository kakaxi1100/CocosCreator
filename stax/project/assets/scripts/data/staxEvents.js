var ns = require('staxNamingSpace');

ns.StaxEvents = cc.Class({

	extends : cc.EventTarget,

	ctor : function() {

	},
	properties : {

		TOGGLE_SOUND : 'toggle_sound',
	}
});

module.exports = ns.StaxEvents;
