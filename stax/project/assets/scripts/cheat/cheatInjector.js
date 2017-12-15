
function injectCheatModule (sceneName, url){
    cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function(){

        var scene = cc.director.getScene();

        if(scene.name.indexOf(sceneName) >= 0){
                // load url
                cc.loader.loadRes(url, cc.Prefab, function(err, res){
                    if(err){
                        cc.error(err);
                        return ;
                    }else{
                        var obj = cc.instantiate(res);
                        scene.children[0].addChild(obj, 1000);
                    }
                });
        }
    }); 
}

function removeSceneListeners(sceneName){
    var sceneListeners = cc.sceneListeners;
    sceneListeners[sceneName] = null;
}

function tryReadVersion(){
	if(cc){
		readVersion();		
	}else{
		setTimeout(tryReadVersion, 500);
	}
}

function readVersion(){
//TODO
}

if(!CC_EDITOR){
    (function(){
        'use strict';

        injectCheatModule("game", "prefabs/Cheat");

        tryReadVersion();
    })();
}
