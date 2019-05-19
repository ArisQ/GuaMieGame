// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const Miemie=require('Miemie');

cc.Class({
    extends: cc.Component,

    properties: {
        debugLabel: {
            default: null,
            type: cc.Label
        },
        guaguaPrefab: {
            default: null,
            type: cc.Prefab
        },
        miemie: {
            default: null,
            type: Miemie
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        healtPointLabel: {
            default: null,
            type: cc.Label
        },
        startButton: {
            default: null,
            type: cc.Node
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        thanksLabel: {
            default: null,
            type: cc.Node
        },
        backgroundAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.debugLabel.string = 'loading...';
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
            cc.PhysicsManager.DrawBits.e_pairBit |
            cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit;
        cc.director.getPhysicsManager().debugDrawFlags = 0;

        this.node.on(cc.Node.EventType.MOUSE_MOVE,this.onMove,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onMove,this);

        this.enabled=false;
        this.miemie.enabled=false;

        this.guaguaSet=new Set([]);
        this.guaguaPool = new cc.NodePool('Guagua');

        this.guaguaCount=0;//guagua次数，用于计算level等级

        this.backgroundMusic=null;
    },

    onDestroy(){
        cc.audioEngine.stopMusic();
        this.node.off(cc.Node.EventType.MOUSE_MOVE,this.onMove,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onMove,this);
    },

    onStartGame(){
        this.score=0;
        this.healthPoint=5;
        this.scoreLabel.string = 'Score: ' + this.score;
        this.healtPointLabel.string = 'HP: ' + this.healthPoint;

        this.guaguaCount=0;

        this.miemie.resetPosition();
        this.miemie.startMove();

        this.enabled=true;
        this.schedule(this.spawnNewGuagua,2);
        
        this.startButton.x = 3000;
        this.gameOverNode.active=false;
        this.thanksLabel.active=false;
        
        if(!this.backgroundMusic)
            this.backgroundMusic=cc.audioEngine.playMusic(this.backgroundAudio, true);
        cc.audioEngine.resumeMusic();
    },
    gameOver: function () {
        cc.audioEngine.pauseMusic();

        console.log('game over')
        this.unschedule(this.spawnNewGuagua);
        this.enabled=false;

        for (let guagua of this.guaguaSet.values()) {
            // guagua.destory();
            this.despawnGuagua(guagua);
        }
        this.guaguaSet.clear();

        this.miemie.stopMove();

        this.startButton.x = 0;
        this.gameOverNode.active=true;
        this.thanksLabel.active=true;
    },

    spawnNewGuagua: function() {
        let newGuagua = null;
        if(this.guaguaPool.size()>0) {
            newGuagua=this.guaguaPool.get()
        }else{
            newGuagua = cc.instantiate(this.guaguaPrefab);
        }
        newGuagua.getComponent('Guagua').game = this;
        this.guaguaSet.add(newGuagua);
        this.node.addChild(newGuagua);

        //get position & velocity
        let level=Math.floor(this.guaguaCount/10);
        let position=cc.v2(0,this.node.height/2-40);//宽度减去呱呱宽度[的一半]
        let velocity=cc.v2(0,300);
        if(level===0) {
            position.x=(Math.random()-0.5)*this.node.width/2;
        } else if(level===1) {
            velocity=cc.v2((Math.random()-0.5)*600,300+Math.random()*300);
        }else{
            position.x=(Math.random()-0.5)*this.node.width/2;
            velocity=cc.v2((Math.random()-0.5)*600*(level-1),(300+Math.random()*300)*(level-1));
        }

        let rigidbody=newGuagua.getComponent('cc.RigidBody');
        rigidbody.linearVelocity=velocity;
        rigidbody.fixedRotation=true;

        newGuagua.setPosition(position); //todo: 生成的guagua的属性

        this.guaguaCount++;
    },
    despawnGuagua(guagua) {
        this.guaguaSet.delete(guagua);
        this.guaguaPool.put(guagua);
    },
    onMove:function(event) {
        // this.debugLabel.string=event.getLocation()+'\n'+
        //         this.miemie.position+'\n'+ 
        //         event.getLocationInView()+'\n'+
        //         this.node.convertToNodeSpace(event.getLocation()) +'\n'+
        //         this.node.convertToNodeSpaceAR(event.getLocation()) +'\n';
        if(this.enabled) {//简单判断，TODO：实现咩咩的移动
            let x=this.node.convertToNodeSpaceAR(event.getLocation()).x;
            let y=this.miemie.node.position.y;
            let absX=Math.abs(x);
            this.debugLabel.string=''+x+'\n'+absX+'\n'+this.node.width+'\n'+this.miemie.node.width;
            if(absX>this.node.width/2-this.miemie.node.width/2)
                absX=this.node.width/2-this.miemie.node.width/2; //不能超出边界
            if(x<0)
                x=-absX;
            else
                x=absX;
            this.miemie.node.setPosition(x,y);
        }
    },

    gainScore: function () {
        this.score += 1;
        this.scoreLabel.string = 'Score: ' + this.score;
    },
    loseHealthPoint: function () {
        if(this.healthPoint>0)
            this.healthPoint -= 1;
        if(this.healthPoint<=0) {
            this.gameOver();
        }
        this.healtPointLabel.string = 'HP: ' + this.healthPoint;
    },
});
