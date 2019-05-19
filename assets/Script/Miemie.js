// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        debugLabel: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.heartBeatAction=this.setHeartBeatAction();
        
        this.enabled=false;
    },

    resetPosition(){
        this.node.x=0;
    },

    startMove: function () {
        this.enabled = true;
        // this.xSpeed = 0;
        this.node.runAction(this.heartBeatAction);
    },

    stopMove: function () {
        this.enabled = false;
        this.node.stopAllActions();
    },

    setHeartBeatAction:function(){
        var duration=0.5
        var systole=cc.scaleTo(duration,1.2,0.8).easing(cc.easeCubicActionIn());
        var diastole=cc.scaleTo(duration,1,1).easing(cc.easeCircleActionOut());
        return cc.repeatForever(cc.sequence(systole, diastole));   
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        // otherCollider.onCatched();
        // console.log(otherCollider)
        // this.debugLabel.string=JSON.stringify(otherCollider.keys());
        let guagua=otherCollider.getComponent('Guagua');
        guagua.onCatched();
    },
});
