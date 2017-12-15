var ns = require('staxNamingSpace');
var JSONC = require('jsonc');

ns.GameCache = cc.Class({
	
	ctor: function ()
    {
    	
        this._cacheDebug = false;
        
        this.groupsLength = 0;
        this._ready = false;
        this._isLoading = false;
        this._loadedAssets = 0;
        this._percent = 0;
        this._callback = null;
        this._assetLoadedCB = null;
        
        this._atlases = [];
        this._jsons = [];
        this._sounds = [];
        this._prefabs = [];
        this._animations = [];
        this._fonts = [];
        this._scenes = [];
        this._textures2D = [];
        this._autoAtlas = [];
        this._cursors = [];
        this._folderSprites = [];
        
        this._urls =  
        [
             // CACHE_GROUP.DEFAULT
             [{ "type" : "Json", "url" : "data/gameInfo"}],
                   
            // CACHE_GROUP.GAMEPLAY
             [{ "type" : "Scene", "url": "scenes/game"},
             { "type" : "FolderSprites", "url": "textures/ranks", "key":"rank"}
             //eg. { "type" : "FolderSprites", "url": "textures/cardRes", "key":"cardRes"},
             // { "type" : "FolderSprites", "url": "textures/ranks", "key":"rank"},
                /*
                key needs to be same as sub-directory: eg. metagame, game, 
                as to "metagame/darkoval.png",
                we use "metagame"(the word after images/ and before image name) as its key
                */
             //eg. {"type" : "FolderTextures", "url" : "textures/test", "key":"test"}
             ]
        ];
    },
    
    getSpriteFrame: function(name)
    {
        for (var key in this._atlases)
        {
            var frame = this._atlases[key].getSpriteFrame(name);
            if(frame)
            {
                return frame;
            }
        }

        for (var key in this._folderSprites)
        {
            var frame = this._folderSprites[key][name];
            if(frame)
            {
                return frame;
            }
        }
        
        return null;
    },

    getAtlas: function(name)
    {
        return this._atlases[name];
    },
    
    getJson: function(name)
    {
        return this._jsons[name];
    },
    
    getSound: function(name)
    {
        // This returns the path, not the sound itself.
        return this._sounds[name];
    },
    
    getPrefab: function(name)
    {
        return this._prefabs[name];
    },
    
    getAnimation: function(name)
    {
        return this._animations[name];
    },
    
    getFont: function(name)
    {
        return this._fonts[name];
    },
    
    getScene: function(name)
    {
        return this._scenes[name];
    },
    
    getTexture2D: function(name)
    {
        return this._textures2D[name];
    },

    getCursor: function(name)
    {
        return cc.url.raw("resources/" + name + ".cur");
        //return this._cursors[name];
    },

    isReady: function()
    {
        return this._ready;
    },

    isLoading: function()
    {
        return this._isLoading;
    },

    getPercent: function()
    {
        return this._percent;
    },

    getCount: function(cacheGroup)
    {
        return this._urls[cacheGroup].length;
    },
    
    //can be used for skin changing & episode changing
    replaceResourceUrl: function(cacheGroup, key, url )
    {
    	for(var i = 0; i <  this._urls[cacheGroup].length; i++){
    		var k = this._urls[cacheGroup][i].key ||this._urls[cacheGroup][i].url;
    		if(k == key){
    			this._urls[cacheGroup][i].url = url;
    			break;
    		}
    	}
        
    },
    
    _load: function(curType,url,key,index)
    {
        var res = cc.loader.getRes(url);
        
        if(res)
        {
            if(this._cacheDebug)
            {
                cc.log("LOADING (Cached): " + url);
            }
            
            this._pushToContainer(curType,url,key,res);
            this._updateStatus(true);
        }
        else
        {
            if(this._cacheDebug)
            {
                cc.log("LOADING: " + url);
            }
            
            switch (curType)
            {
                case "SpriteAtlas":
                {
                    cc.loader.loadRes(url, cc.SpriteAtlas, this._loadCallBack.bind(this,curType,url,key,index));
                    break;    
                }
                case "Scene":
                {
                    cc.loader.loadRes(url, this._loadCallBack.bind(this,curType,url,key,index));
                    break;
                }
                case "Json":
                {
                    cc.loader.loadRes(url, this._loadCallBack.bind(this,curType,url,key,index));
                    break;
                }
                case "Sound":
                {
                    // Bug cc.AudioClip doesn't support m4a format.
                    cc.loader.loadRes(url, /*cc.AudioClip,*/ this._loadCallBack.bind(this,curType,url,key,index));
                    break;
                }
                case "Prefab":
                {
                    cc.loader.loadRes(url, cc.Prefab, this._loadCallBack.bind(this,curType,url,key,index));
                    break;
                }
                case "Animation":
                {
                    cc.loader.loadRes(url, cc.AnimationClip, this._loadCallBack.bind(this,curType,url,key,index));
                    break;
                }
                case "Font":
                {
                    cc.loader.loadRes(url, cc.Font, this._loadCallBack.bind(this,curType,url,key,index));
                    break;    
                }
                case "Scene":
                {
                    cc.loader.loadRes(url, cc.Scene, this._loadCallBack.bind(this,curType,url,key,index));
                    break;    
                }
                case "Texture2D":
                {
                    cc.loader.loadRes(url, cc.Texture2D, this._loadCallBack.bind(this,curType,url,key,index));
                    break;    
                }
                case "FolderTextures":
                {
                    cc.loader.loadResDir(url, cc.Texture2D, this._loadCallBack.bind(this, curType, url, key, index));
                    break;
                }
                case "AutoAtlas":
                {
                    cc.loader.loadRes(url, cc.AutoAtlas, this._loadCallBack.bind(this,curType,url,key,index));
                    break;
                }
                case "Cursor":
                {
                    cc.loader.loadRes(url, this._loadCallBack.bind(this,curType,url,key,index));
                    break;
                }
                case "FolderSprites":
                {
                    cc.loader.loadResDir(url, this._loadCallBack.bind(this,curType,url,key,index));
                }
                default:
                {
                    break;
                }
            }
        }
    },
    
    preload: function (cacheGroupArray)
    {
        this._ready = false;
        this._isLoading = true;
        this._loadedAssets = 0;
        this._percent = 0;
        this.groupsLength = 0;

        for(var i = 0; i< cacheGroupArray.length; i++)
        {
            this.groupsLength += this._urls[cacheGroupArray[i]].length;
        }

        for(var i = 0; i< cacheGroupArray.length; i++)
        {
            var cacheGroup = cacheGroupArray[i];
            for(var j = 0; j < this._urls[cacheGroup].length ; j++)
            {
                var url = this._urls[cacheGroup][j]["url"];
                var curType = this._urls[cacheGroup][j]["type"];
                var key = this._urls[cacheGroup][j]["key"]||this._urls[cacheGroup][j]["url"];
                this._load(curType,url,key,j);
            }
        }
        
        if(this._cacheDebug)
        {
            cc.log("[ "+ (this._percent * 100).toFixed(2) +"% ]");
        }
    },
    
    unload: function(cacheGroup)
    {
        if(this._ready)
        {
            for(var i = 0; i < this._urls[cacheGroup].length ; i++)
            {
                var url = this._urls[cacheGroup][i]["url"];
                var curType = this._urls[cacheGroup][i]["type"];
                var key = this._urls[cacheGroup][i]["key"]||this._urls[cacheGroup][i]["url"];
                
                if(this._cacheDebug)
                {
                    cc.log("UNLOADING: " + url);
                }
                
                cc.loader.releaseRes(url);
                
                switch(curType) 
                {
                    case "SpriteAtlas":
                    {
                        delete this._atlases[key];
                        break;
                    }
                    case "Json":
                    {
                         delete this._jsons[key];
                        break;
                    }
                    case "Sound":
                    {
                        delete this._sounds[key];
                        break;
                    }
                    case "Prefab":
                    {
                        delete this._prefabs[key];
                        break;
                    }
                    case "Animation":
                    {
                        delete this._animations[key];
                        break;
                    }
                    case "Font":
                    {
                        delete this._fonts[key];
                        break;
                    }
                    case "Scene":
                    {
                        delete this._scenes[key];
                        break;
                    }
                    //case "FolderTextures":
                    case "Texture2D":
                    {
                        delete this._textures2D[key];
                        break;
                    }
                    case "AutoAtlas":
                    {
                        delete this._autoAtlas[key];
                        break;
                    }
                    case "Cursor":
                    {
                        delete this._cursors[key];
                        break;
                    }
                    case "FolderSprites":
                    {
                        delete this._folderSprites[key];
                    }
                    default:
                    {
                        break;
                    }
                }
            }
        }
    },
    
    setReadyCallback : function(callback)
    {
        this._callback = callback;
    },

    setAssetLoadedCallback: function(callback)
    {
        this._assetLoadedCB = callback;
    },
    
    _loadCallBack: function (type, url, key, index, err, res)
    {
        if (err)
        {
            if(type === "Json")
            {
                res = JSON.parse(JSONC.minify(res));
                this._pushToContainer(type,url,key,res);
            }
            else
            {
                cc.log('Error url [' + err + ']');
            }
        }
        else
        {
            this._pushToContainer(type,url,key,res);
        }
        
        if(this._assetLoadedCB)
        {
            this._assetLoadedCB(url,key,index);
        }

        this._updateStatus(false);
    },
    
    _pushToContainer: function(type,url,key,res)
    {
        switch(type) 
        {
            case "SpriteAtlas":
            {
                this._atlases[key] = res;
                break;
            }
            case "Json":
            {
                this._jsons[key] = res;
                break;
            }
            case "Sound":
            {
                this._sounds[key] = res;
                break;
            }
            case "Prefab":
            {
                this._prefabs[key] = res;
                break;
            }
            case "Animation":
            {
                this._animations[key] = res;
                break;
            }
            case "Font":
            {
                this._fonts[key] = res;
                break;
            }
            case "Scene":
            {
                this._scenes[key] = res;
                break;
            }
            case "Texture2D":
            {
                this._textures2D[key] = res;
                break;
            }
            case "FolderTextures":
            {
                for(var i in res){
                    var str = res[i].url;
                    var list = str.split("/");
                    str = list[list.length - 1];
                    str = key + "/" + str;
                    this._textures2D[str] = res[i];
                }
                break;
            }
            case "AutoAtlas":
            {
                this._autoAtlas[key] = res;
                break;
            }
            case "Cursor":
            {
                this._cursors[key] = res;
                break;
            }
            case "FolderSprites":
            {
                var pack = {};
                for(var i in res){
                    var sf = res[i];
                    pack[sf.name] = sf;
                }
                this._folderSprites[key] = pack;
            }
            default:
            {
                break;
            }
        }
    },
    
    _updateStatus: function(cached)
    {
        if(this.groupsLength > 0  )
        {
            if(!cached)
            {
                this._loadedAssets++;
            }
            else
            {
                this.groupsLength = Math.max(0,this.groupsLength-1);
            }
            
            this._percent = (this._loadedAssets / this.groupsLength);
            
            if(this._cacheDebug && !cached)
            {
                cc.log("[ "+ (this._percent * 100).toFixed(2) +"% ]");
            }
            
            if(this._loadedAssets == this.groupsLength)
            {
                // End preloading
                
                this._ready = true;
                this._isLoading = false;
                
                if(this._callback)
                {
                    this._callback();
                }
            }
        }
    }
});

module.exports = ns.GameCache;

