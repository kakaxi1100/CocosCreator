var ns = require('safariNamingSpace');

ns.SafariConstants = {
	CACHE_GROUP : cc.Enum({
		DEFAULT : 0,
		GAMEPLAY : 1
	}),

	DAY_MILLSECONDS : 86400000,
	HOUR_MILLSECONDS : 3600000,
	MINUTE_MILLSECONDS : 60000,
	SECOND_MILLSECONDS : 1000,

};

module.exports = ns.SafariConstants; 
