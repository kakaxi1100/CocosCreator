var ns = require('safariNamingSpace');

ns.SafariEvents = cc.Class({

	extends : cc.EventTarget,

	ctor : function() {

	},
	properties : {

		TOGGLE_SOUND : 'toggle_sound',
	}
});

module.exports = ns.SafariEvents;
