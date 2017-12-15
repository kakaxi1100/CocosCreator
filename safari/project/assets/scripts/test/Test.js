cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.sprite = new cc.Sprite();
        this.spriteFrames = [];
        this.curIndex = 0;
        this.loop = false;
        this.isPlaying = false;
        this.duration = 100;
    },

    update: function (dt) {
        console.log("1");
    },
});
