var ns = require('staxNamingSpace');

ns.sdkLoader = require('pogoSDKLoader');
ns.POGOSDK = null;
ns.SDK = new (require('pogoSDKAdapter'));

ns.gameVersion = require('gameVersion');
ns.cache = new (require("gameCache"));
ns.res = new (require('gameRes'));

ns.playerData = new (require('playerData'));

ns.events = new (require('staxEvents'));
ns.settings = require('staxSettings');
ns.constants = require('staxConstants');
ns.strings = require('staxStrings');

ns.soundMgr = new (require('soundMgr'));

//IE not suppot promise
require('es6-promise').polyfill();

ns.PreloadMenu = cc.Class({
	extends : cc.Component,

	properties : {
		loadPercentLabel : cc.Label,
	},

	onLoad : function() {
		this.stepList = [this.initDefaultCacheGroup, this.initSDK, this.initRandom, this.initNextSceneCacheGroup, this.loadNextScene];

		this.currentStep = -1;
		this.nextStep();
	},

	nextStep : function() {
		this.currentStep++;
		cc.log(this.currentStep + "/" + this.stepList.length);
		if (this.currentStep >= this.stepList.length) {
			return;
		}
		this.stepList[this.currentStep].apply(this);
	},

	initDefaultCacheGroup : function() {
		ns.cache.setReadyCallback(this.nextStep.bind(this));
		ns.cache.setAssetLoadedCallback(this._onAssetLoaded.bind(this));
		ns.cache.preload([ns.constants.CACHE_GROUP.DEFAULT]);
	},

	_onAssetLoaded : function(url, key) {
		cc.log('_onAssetLoaded', url, key);
	},

	initSDK : function() {
		cc.log("init SDK...");
		ns.sdkLoader.load(ns, this.nextStep.bind(this));
	},

	initRandom : function() {
		ns.SDK.initSeed();
		this.scheduleOnce(this.nextStep.bind(this), 0.01);
	},

	initNextSceneCacheGroup : function() {
		ns.cache.setReadyCallback(this.nextStep.bind(this));
		ns.cache.setAssetLoadedCallback(this._onAssetLoaded.bind(this));
		ns.cache.preload([ns.constants.CACHE_GROUP.GAMEPLAY]);
	},

	loadNextScene : function() {
		cc.director.loadScene("game");
	},
});
