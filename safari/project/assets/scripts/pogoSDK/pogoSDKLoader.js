/**
 * please call loader just once
 */
var PogoSDK = require('pogoSDK');

var ENVIRONMENT = "alpha";
var GAMEID      = 386;
var HostNames = "cdn-h5poppit-test.pogospike.com, cdn-h5poppit-stage.pogospike.com, cdn-h5poppit-prod.pogospike.com";

var loadCallback = null;
var gameUrl = "";

var SDK = null;
var ns = null;
module.exports = {
    load:function(container, callback){
        loadCallback = callback;

        gameUrl = window.location.href;
        var hostName = window.location.hostname;

        var lkey = getParameterByName('lkey', gameUrl);
        cc.log(lkey);

        var isDev = !lkey && (HostNames.indexOf(hostName) > -1 ? false : true);
        if(!isDev){           
            ns = container;

            ns.POGOSDK = new PogoSDK({
                gameId: GAMEID
            });

            SDK = ns.POGOSDK;

            SDK.ready().then(sdkReady).catch(sdkInitErr);
        }
        else if(ENVIRONMENT === 'alpha'){
            // dev mode
            if(loadCallback)loadCallback();
        }
    }
};

var getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var sdkReady = function(result){
    SDK.addPreferenceChangeHandler(preferenceChangeHandler);
    SDK.addPauseHandler(dummyPauseHandler);
    SDK.setNewGameHandler(newGameHandler);
    SDK.setTearDownHandler(dummyTearDownHandler);


    cc.log("SDK ready");

    cc.log(SDK.getProfile());
    

    if(loadCallback)loadCallback();

    return null;
};

var preferenceChangeHandler = function(name, value, preferences){
    if (name === 'sound') {
        if(value){
            ns.events.emit(ns.events.SWITCH_SOUND, true);
        }
        else{
            ns.events.emit(ns.events.SWITCH_SOUND, false);
        }
    }    
};

var dummyPauseHandler = function(resume){

};

var newGameHandler = function(){
    ns.events.emit(ns.events.POPPIT_NEW_GAME);
};

var dummyTearDownHandler = function(){

};

var sdkInitErr = function(err){
    SDK.logError("An error occurred during pause menu.", "app.js", 240, 9, err);
    SDK.logEvent("error modal", "pause menu");
};
