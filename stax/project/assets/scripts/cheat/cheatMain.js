cc.Class({
    extends: cc.Component,

    properties: {
        cheatList:cc.Node
    },

    // use this for initialization
    onLoad: function () {

    },

    switchCheatMenu: function(){
        this._showMenu = this._showMenu ? false : true;

        this.cheatList.active = this._showMenu;
    }
});
