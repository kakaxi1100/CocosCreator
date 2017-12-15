var ns = require('safariNamingSpace');
var timezone = require('timezone');

ns.GameUtils = cc.Class({
	/**
	 * convert source position to target space
	 */
	convertToTargetSpace : function(source, target) {
		var sp = source.convertToWorldSpace(new cc.Vec2(0, 0));
		return target.convertToNodeSpace(sp);
	},

	/**
	 * used for simple get components,
	 * !!!DO NOT SUPPORT MULTIPLE SCRIPTS WITH SAME NAME
	 */
	createNodePro : function(prefab, componentList) {
		var obj = cc.instantiate(prefab);
		var script = null;
		for (var i = 0; i < componentList.length; i++) {
			script = obj.getComponent(componentList[i]);
			if (script) {
				obj[componentList[i]] = script;
			}
			script = null;
		}
		return obj;
	},

	arraySort : function(arr, sortFunction) {
		for (var i = 0; i < arr.length; i++) {
			for (var j = i + 1; j < arr.length; j++) {
				if (sortFunction(arr[i], arr[j]) > 0) {
					var temp = arr[i];
					arr[i] = arr[j];
					arr[j] = temp;
				}
			}
		}
		return arr;
	},

	resizeNode : function(node, targetWidth, targetHeight) {
		var factor = 1;
		if (targetWidth != -1) {
			factor = Math.min(factor, targetWidth / node.width);
		}

		if (targetHeight != -1) {
			factor = Math.min(factor, targetHeight / node.height);
		}

		node.setScale(factor, factor);
	},

	formatNumString : function(num) {
		var str = "";
		while (num >= 1000) {
			var temp = num % 1000;

			if (temp < 100) {
				temp = "0" + temp;
			}
			if (temp < 10) {
				temp = "0" + temp;
			}
			str = "," + temp + str;
			num = Math.floor(num / 1000);
		}
		str = num + str;
		return str;
	},

	sumArray : function(arr, exceptKeys) {
		exceptKeys = exceptKeys || [];
		var sum = 0;
		for (var key in arr) {
			if (exceptKeys.indexOf(key) == -1) {
				sum += arr[key];
			} else {
				cc.log("find except key" + key);
			}
		}
		return sum;
	},

	shuffle : function(a) {
		for (var i = a.length; i; i--) {
			var j = Math.floor(Math.random() * i); [a[i - 1], a[j]] = [a[j], a[i - 1]];
		}
	},

	getTimeStringByMillSeconds : function(millseconds, numSection) {
		var second = Math.ceil(millseconds / ns.constants.SECOND_MILLSECONDS);
		return this.getTimeStringBySeconds(second, numSection);
	},

	getTimeStringWithDayByMillSeconds : function(millseconds) {
		var second = Math.ceil(millseconds / ns.constants.SECOND_MILLSECONDS);
		return this.getTimeStringBySecondsWithDay(second);
	},

	getTimeStringBySeconds : function(secs, numSection) {
		secs = Math.max(0, secs);

		var hours = Math.floor(secs / 3600);
		var minutes = Math.floor((secs % 3600) / 60);
		var seconds = Math.floor((secs % 60));

		if (numSection) {
			if (hours > 0) {
				return hours + "h " + (minutes < 10 ? "0" : "") + minutes + "m " + (seconds < 10 ? "0" : "") + seconds + "s";
			}
			return minutes + "m " + (seconds < 10 ? "0" : "") + seconds + "s";
		}

		if (hours > 0) {
			return hours + "h " + (minutes < 10 ? "0" : "") + minutes + "m";
		}
		return minutes + "m " + (seconds < 10 ? "0" : "") + seconds + "s";
	},

	getTimeStringBySecondsWithDay : function(secs) {
		secs = Math.max(0, secs);

		var days = Math.floor(secs / (3600 * 24));
		var hours = Math.floor((secs % (3600 * 24)) / 3600);
		var minutes = Math.floor((secs % 3600) / 60);
		var seconds = Math.floor((secs % 60));

		if (days > 0) {
			return days + "d:" + (hours < 10 ? "0" : "") + hours + "h";
		}

		if (hours > 0) {
			return hours + "h:" + (minutes < 10 ? "0" : "") + minutes + "m";
		}
		return minutes + "m:" + (seconds < 10 ? "0" : "") + seconds + "s";
	},

	getTodayInMillSeconds : function() {
		var today = new Date();
		return today.getHours() * ns.constants.HOUR_MILLSECONDS + today.getMinutes() * ns.constants.MINUTE_MILLSECONDS + today.getSeconds() * ns.constants.SECOND_MILLSECONDS + today.getMilliseconds();
	},

	getUTCMillseconds : function() {
		var date = new Date();
		return date.getTime() - date.getTimezoneOffset() * ns.constants.MINUTE_MILLSECONDS;
	},

	getPSTMillis : function() {
		var date = new Date();
		var utc = date.getTime();
		return utc - timezone.getZoneOffset(utc);
	},

	getLocalDayCount : function(t) {
		return Math.floor(t / ns.constants.DAY_MILLSECONDS);
	},

	removeByValue : function(arr, val, special) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == val) {
				return arr.splice(i, 1)[0];
			}
		}
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == special) {
				return arr.splice(i, 1)[0];
			}
		}
	},

	logObject : function(obj, shift) {
		shift = shift || 0;
		var indent = '';
		for (var i = 0; i < shift; i++) {
			indent += '\t';
		}

		if ( typeof obj === 'object') {
			for (var prop in obj) {
				if ( typeof obj[prop] === 'object') {
					cc.log(indent + prop + ': ');
					logObject(obj[prop], shift + 1);
				} else {
					cc.log(indent + prop + ': ' + obj[prop]);
				}
			}
		} else {
			cc.log(indent + obj);
		}
	},
});

module.exports = ns.GameUtils;

if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}
