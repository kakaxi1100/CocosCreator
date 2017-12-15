var ns = require('staxNamingSpace');

ns.Balloon = cc.Class({
    extends: cc.Component,

    properties: {
        balloon : cc.Node
    },

    // use this for initialization
    onLoad: function () {

    },

    pop: function() {
        this.getComponent(cc.Animation).play();
    }
});
