var ns = require('safariNamingSpace');

ns.CommonButton = cc.Class({
	extends : cc.Component,

	properties : {
		disabledColor : cc.Color,
		clickEvents : [cc.Component.EventHandler],
		isActive : true,
		commonSound : true,
		mouseOverScaleX : 1.1,
		mouseOverScaleY : 1.1,
	},

	onLoad : function() {
		this.node.on(cc.Node.EventType.MOUSE_ENTER, this.mouseEnterHandler, this);
		this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.mouseLeaveHandler, this);
		this.node.on(cc.Node.EventType.TOUCH_START, this.mouseDownHandler, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.mouseUpHandler, this);
		if (!this.colorNode) {
			this.colorNode = this.node.getChildByName('color');
			this.normalColor = this.colorNode.color;
		}
		this.setActive(this.isActive);
	},

	onDestroy : function() {
		this.node.off(cc.Node.EventType.MOUSE_ENTER, this.mouseEnterHandler, this);
		this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.mouseLeaveHandler, this);
		this.node.off(cc.Node.EventType.TOUCH_START, this.mouseDownHandler, this);
		this.node.off(cc.Node.EventType.TOUCH_END, this.mouseUpHandler, this);
	},

	setActive : function(bool) {
		this.isActive = bool;

		if (!this.colorNode) {
			this.colorNode = this.node.getChildByName('color');
			this.normalColor = this.colorNode.color;
		}

		this.colorNode.color = this.isActive ? this.normalColor : this.disabledColor;
		if (!this.isActive) {
			this.node.stopAllActions();
			this.node.setScale(1, 1);
		} else {

		}

	},

	setIsCommonSound : function(bool) {
		this.commonSound = bool;
	},

	mouseEnterHandler : function(evt) {
		if (!this.isActive) {
			return;
		}
		this.node.stopAllActions();
		this.node.runAction(cc.scaleTo(0.2, this.mouseOverScaleX, this.mouseOverScaleY));
	},

	mouseLeaveHandler : function(evt) {
		this.mouseDown = false;
		if (!this.isActive) {
			return;
		}
		this.node.stopAllActions();
		this.node.runAction(cc.scaleTo(0.2, 1.0, 1.0));
	},

	mouseDownHandler : function(evt) {
		this.mouseDown = true;
	},

	mouseUpHandler : function(evt) {
		if (!this.isActive) {
			return;
		}
		if (!this.mouseDown) {
			return;
		}
		if (this.commonSound) {
			//ns.soundMgr.playSound('button_confirm.mp3');
		}
		this.mouseDown = false;

		this.node.stopAllActions();

		var seq = cc.sequence(cc.scaleTo(0.05, 1.0, 1.0), cc.scaleTo(0.2, this.mouseOverScaleX, this.mouseOverScaleY));
		this.node.runAction(seq);

		for (var i = 0; i < this.clickEvents.length; i++) {
			var evtHandler = this.clickEvents[i];
			evtHandler.target.getComponent(evtHandler.component)[evtHandler.handler](evt, evtHandler.customEventData);
		}
	},

	setColor : function(color) {
		if (this.colorNode) {
			this.colorNode.color = color;
		}
	},

	startPulse : function() {
		if (!this.isPulse) {
			this.isPulse = true;
			this.checkPulse();
		}
	},

	checkPulse : function() {
		if (this.isPulse) {
			var startTime = pp.gameUtils.getUTCMillseconds() % 1000 / 1000;
			cc.log('startTime',startTime);
			this.node.getComponent(cc.Animation).play("commonBtnPulse", startTime);
			this.scheduleOnce(this.checkPulse.bind(this),1-startTime);
		}
	},

	stopPulse : function() {
		if (this.isPulse) {
			cc.log(';stopPulse');
			this.isPulse = false;
			this.node.getComponent(cc.Animation).stop("commonBtnPulse");
		}
		
	}
});
