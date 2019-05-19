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
        welcomeLabel: {
            default: null,
            type: cc.Label
        },
        welcomeString: {
            default: '',
            multiline:true
        },
        nextButton: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene("game", function () {
            cc.log("Next scene preloaded");
        });
        this.stringIndex=0;
        this.stringLength=this.welcomeString.length
    },
    start() {
        this.schedule(this.showText,0.1)
    },
    onNext(){
        cc.director.loadScene("game");
    },
    showText(){
        this.stringIndex++;
        this.welcomeLabel.string=this.welcomeString.substring(0,this.stringIndex);
        if(this.stringIndex>this.stringLength) {
            this.unschedule(this.showText);
            this.nextButton.active=true;
        }
    }
});
