var ns = require('safariNamingSpace');

ns.SDKAdaper = cc.Class({
    getGems: function(){
        if(ns.POGOSDK){
            cc.log('gems:'+ns.POGOSDK.getProfile().gems);
            return ns.POGOSDK.getProfile().gems;
        }
        else{
            return 0;
        }
    },

    getSound: function(){
        if(ns.POGOSDK){
            cc.log('sound on:'+ns.POGOSDK.getPreferences().sound);
            return ns.POGOSDK.getPreferences().sound;
        }
        else{
            return true;
        }
    },

    getPlayerEntitlement: function(){
        if(ns.POGOSDK){
            return ns.POGOSDK.getProfile().entitlement;
        }
        else{
            return null;
        }        
    },

    isGuest:function(){
        if(this.getPlayerEntitlement() == "GUEST"){
            return true;
        }
        return false;
    },

    isFree:function(){
        if(this.getPlayerEntitlement() == "FREE"){
            return true;
        }
        return false;
    },

    isClub:function(){
        if(ns.POGOSDK){
            if(this.getPlayerEntitlement() == "CLUB"){
                return true;
            }
        }
        else{
            return true;
        }
    },

    redirectToGemsPage: function(){
        if(ns.POGOSDK){
            ns.POGOSDK.redirectTo('gemFund');
        }
    },

    redirectToUpsellPage: function(){
        if(ns.POGOSDK){
            ns.POGOSDK.redirectTo('clubUpsell');
        }
    },

    showSaleUpsell: function(){
        if(ns.POGOSDK){
            ns.POGOSDK.showSaleUpsell();
        }        
    },

    showMenu: function() {
        if(ns.POGOSDK){
            if(true/*TODO*/){
                ns.POGOSDK.showServiceMenu('preGame');
            }
            else{
                ns.POGOSDK.showServiceMenu('inGame');
            }
        }
    },

    getRandomInt: function(num){
		if (ns.POGOSDK) {
			return ns.random.nextInt(num);
		} else {
			return Math.floor(Math.random() * num);
		}        
    },

    setCustomDimension:function(dm){
        if(ns.POGOSDK){
            for(var i in dm){
                ns.POGOSDK.setCustomDimension(dm[i].key, dm[i].value);
                cc.log('[setDimension]:[key:' + dm[i].key + '][value:' + dm[i].value + ']');
            }
        }
    },

    logEvent: function(action, label, value){
        if(ns.POGOSDK){
            ns.POGOSDK.logEvent(action, label, value);
            cc.log("GA:Action:[" + action + "], Label:[" + label + "], Value:[" + value + "].");

            //set poppit party dimensions null
            for(var i = 17; i < 24; i++){
                ns.POGOSDK.setCustomDimension("dimension" + i, null);
            }
            ns.POGOSDK.setCustomDimension("dimension25", null);
        }
        else{
            cc.log("Local:Action:[" + action + "], Label:[" + label + "], Value:[" + value + "].");
        }
    },

    sendLog: function(message){
        //Todo: change to cc.log in prod with debug=false
        console.log(message);
    },

    initSeed: function(){
        if(ns.POGOSDK){
            ns.seed = ns.POGOSDK.getSeed();
            ns.random = new (require('random'))(ns.seed);
            cc.log('seed: '+ns.seed);
        }
    },

    gameStart: function(){
		if(ns.POGOSDK){
			ns.POGOSDK.gameStarted();

            ns.seed = ns.POGOSDK.getSeed();
            ns.random = new (require('random'))(ns.seed);
            cc.log('seed: '+ns.seed);
        }        
    },

    sendGameOver: function(wincodes, seed, stringWincodes){
        if(ns.POGOSDK){
            return ns.POGOSDK.sendGameOver(wincodes, seed, stringWincodes).then(function (result) {
                cc.log('game over result:'+JSON.stringify(result));
            }.bind(this))
            .then(function(){
                return ns.SDK.sendSync();
            }).then(function() {
                return ns.POGOSDK.showToast('token');
            }).then(function() {
                return ns.POGOSDK.showToast('rank');
            }).then(function() {
                return ns.POGOSDK.showGoats();
            }).then(function() {
                return ns.POGOSDK.showServiceMenu('gameOver');
            });
        }
        else{
            return new Promise(function (resolve, reject) {
                resolve(true);
                return;
            }.bind(this));
        }
    },

    sendSyncStats: function(wincodes, stringWincodes){
        if(ns.POGOSDK){
            return ns.POGOSDK.syncStats(wincodes, stringWincodes).then(function (result) {
                cc.log('sync result:'+JSON.stringify(result));
            }.bind(this)).then(function() {
                return ns.POGOSDK.showGoats();
            }).catch((error) => {
                cc.error('Fail to sync:' + error);
                return false;
            });
        }
         else{
            return new Promise(function(resolve, reject){
                resolve(true);
                return;
            }.bind(this));         
        }
    },

    // a dummy sync to trigger rules
    sendSync:function(){
        if(ns.POGOSDK){
            var wincodes = {};
            var stringWincodes = {"event":"trigger"};

            return ns.POGOSDK.syncStats(wincodes, stringWincodes).then(function (result) {
                return result;
            }).then(function(result) {
                return ns.POGOSDK.showGoats();
            }).catch((error) => {
                cc.error('Fail to sync stats' + error);
                return false;
            });
        } 
    }
});

module.exports = ns.SDKAdaper;
