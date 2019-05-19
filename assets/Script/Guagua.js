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
        catchedFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        onCatchedAudio: {
            default: null,
            type: cc.AudioClip
        },
        onMissedAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let rigidBody=this.node.getComponent('cc.RigidBody');
        this.gravityScale=rigidBody.gravityScale;

        this.onCatchFx=null;
        this.catched=false;// 是否已结束，避免重复计分
    },
    unuse(){
        // this.stop
        if(this.onCatchFx) {
            this.onCatchFx.destroy();
            this.onCatchFx=null;
        }
        this.active=false;
    },
    reuse(){
        //清除动画导致的变化，TODO：自动设置，或播放其他动画
        let guagua=this.node.getChildByName('guagua');
        guagua.setPosition(cc.v2(0,0));
        guagua.setScale(1);
        guagua.opacity=255;

        this.catched=false;
        this.enablePhysics();
        this.active=true;
    },
    enablePhysics:function(){
        // this.node.removeComponent('cc.RigidBody');
        // let rigidBody=this.node.getComponent('cc.RigidBody');
        let collider=this.node.getComponent('cc.PhysicsCollider');
        collider.active=true;
        // rigidBody.gravityScale=this.gravityScale;
        // this.node.active=true;
    },
    disablePhysics:function(){
        // this.node.removeComponent('cc.RigidBody');
        // let rigidBody=this.node.getComponent('cc.RigidBody');
        let collider=this.node.getComponent('cc.PhysicsCollider');
        collider.active=false;
        // rigidBody.gravityScale=0;
        // rigidBody.linearVelocity=cc.v2(0,0);
        // this.node.active=false;
    },
    
    onCatched: function() {
        if(this.game) {
            this.disablePhysics();

            //TODO: animation pool
            // fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
            // fx.init(this);
            // var fx = this.spawnScoreFX();
            // this.node.addChild(fx.node);
            // fx.node.setPosition(pos);
            // fx.play();
            
            if(!this.catched) {
                this.catched=true;
                cc.audioEngine.playEffect(this.onCatchedAudio,false);
            
                if(this.onCatchFx) {
                    this.onCatchFx.destroy();
                    this.onCatchFx=null;
                }
                this.onCatchFx=cc.instantiate(this.catchedFXPrefab);
                this.node.addChild(this.onCatchFx);
                this.onCatchFx.setPosition(this.node.position);

                this.game.gainScore();

                this.leave();
            }
        }
    },
    onMissed: function() {
        if(this.game) {
            this.disablePhysics();

            if(!this.catched) {
                this.catched=true;
            
                cc.audioEngine.playEffect(this.onMissedAudio,false);
                this.game.loseHealthPoint();

                this.leave();
            }
        }
    },
    leave(){
        // setTimeout(()=>{
        //     this.game.despawnGuagua(this.node);
        // },1000);
        // this.game.despawnGuagua(this.node);
        let animation = this.getComponent(cc.Animation);
        animation.play('leave');
        animation.on('finished',function(){
            // this.node.destroy();
            this.game.despawnGuagua(this.node);
        },this);
    }
});
