// Important to play the main theme on iOS.
var ns = require('staxNamingSpace');
// cc.audioEngine.setMaxWebAudioSize(3000);
var SoundMgr = cc.Class({

	properties : {
		
	},

	ctor : function() {
		this.soundOn = true;
		this.musicID = -1;
		this.musicName = null;
		ns.events.on(ns.events.TOGGLE_SOUND, this.toggleSound, this);
	},

	setSoundOn : function(val) {
		this.soundOn = val;
		if (!this.soundOn) {
			this.stopAllSounds();
		}
	},

	toggleSound : function(evt) {
		this.soundOn = evt.detail;
        if(!this.soundOn)
        {
            if(this.musicID != -1)
            {
                cc.audioEngine.pause(this.musicID);
            }
        }
        else
        {
            this.playMusic();
        }
	},

	playMusic: function(name)
    {
        if(this.soundOn)
        {
            if(this.musicID != -1)
            {
				cc.audioEngine.resume(this.musicID);
            }
            else
            {
				if(name!=null){
					this.musicName =name;
				}
                this.musicID = cc.audioEngine.play(cc.url.raw('resources/sounds/' + this.musicName), true);
            }
        }
    },

	playSound : function(name) {
		if (!this.soundOn) {
			return;
		}
		return cc.audioEngine.play(cc.url.raw('resources/sounds/' + name), false);
	},

	stopAllSounds : function() {
		cc.audioEngine.stopAll();
		this.musicID = -1
	},

	stopSound : function(id) {
		cc.audioEngine.stop(id);
	}
});

module.exports = SoundMgr; 
