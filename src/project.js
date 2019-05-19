window.__require=function t(e,i,n){function o(c,a){if(!i[c]){if(!e[c]){var h=c.split("/");if(h=h[h.length-1],!e[h]){var u="function"==typeof __require&&__require;if(!a&&u)return u(h,!0);if(s)return s(h,!0);throw new Error("Cannot find module '"+c+"'")}}var d=i[c]={exports:{}};e[c][0].call(d.exports,function(t){return o(e[c][1][t]||t)},d,d.exports,t,e,i,n)}return i[c].exports}for(var s="function"==typeof __require&&__require,c=0;c<n.length;c++)o(n[c]);return o}({Ground:[function(t,e,i){"use strict";cc._RF.push(e,"92307sfRM5FaKbNEdY3vWRK","Ground"),cc.Class({extends:cc.Component,start:function(){},onBeginContact:function(t,e,i){i.getComponent("Guagua").onMissed()}}),cc._RF.pop()},{}],GuaMieGame:[function(t,e,i){"use strict";cc._RF.push(e,"909f7YBvWFMy58xyKlyNrek","GuaMieGame");var n=t("Miemie");cc.Class({extends:cc.Component,properties:{debugLabel:{default:null,type:cc.Label},guaguaPrefab:{default:null,type:cc.Prefab},miemie:{default:null,type:n},scoreLabel:{default:null,type:cc.Label},healtPointLabel:{default:null,type:cc.Label},startButton:{default:null,type:cc.Node},gameOverNode:{default:null,type:cc.Node},thanksLabel:{default:null,type:cc.Node},backgroundAudio:{default:null,type:cc.AudioClip}},onLoad:function(){cc.director.getPhysicsManager().enabled=!0,cc.director.getPhysicsManager().debugDrawFlags=cc.PhysicsManager.DrawBits.e_aabbBit|cc.PhysicsManager.DrawBits.e_pairBit|cc.PhysicsManager.DrawBits.e_centerOfMassBit|cc.PhysicsManager.DrawBits.e_jointBit|cc.PhysicsManager.DrawBits.e_shapeBit,cc.director.getPhysicsManager().debugDrawFlags=0,this.node.on(cc.Node.EventType.MOUSE_MOVE,this.onMove,this),this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onMove,this),this.enabled=!1,this.miemie.enabled=!1,this.guaguaSet=new Set([]),this.guaguaPool=new cc.NodePool("Guagua"),this.guaguaCount=0,this.backgroundMusic=null},onDestroy:function(){cc.audioEngine.stopMusic(),this.node.off(cc.Node.EventType.MOUSE_MOVE,this.onMove,this),this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onMove,this)},onStartGame:function(){this.score=0,this.healthPoint=5,this.scoreLabel.string="Score: "+this.score,this.healtPointLabel.string="HP: "+this.healthPoint,this.guaguaCount=0,this.miemie.resetPosition(),this.miemie.startMove(),this.enabled=!0,this.schedule(this.spawnNewGuagua,2),this.startButton.x=3e3,this.gameOverNode.active=!1,this.thanksLabel.active=!1,this.backgroundMusic||(this.backgroundMusic=cc.audioEngine.playMusic(this.backgroundAudio,!0)),cc.audioEngine.resumeMusic()},gameOver:function(){cc.audioEngine.pauseMusic(),console.log("game over"),this.unschedule(this.spawnNewGuagua),this.enabled=!1;var t=!0,e=!1,i=void 0;try{for(var n,o=this.guaguaSet.values()[Symbol.iterator]();!(t=(n=o.next()).done);t=!0){var s=n.value;this.despawnGuagua(s)}}catch(t){e=!0,i=t}finally{try{!t&&o.return&&o.return()}finally{if(e)throw i}}this.guaguaSet.clear(),this.miemie.stopMove(),this.startButton.x=0,this.gameOverNode.active=!0,this.thanksLabel.active=!0},spawnNewGuagua:function(){var t=null;(t=this.guaguaPool.size()>0?this.guaguaPool.get():cc.instantiate(this.guaguaPrefab)).getComponent("Guagua").game=this,this.guaguaSet.add(t),this.node.addChild(t);var e=Math.floor(this.guaguaCount/10),i=cc.v2(0,this.node.height/2-40),n=cc.v2(0,300);0===e?i.x=(Math.random()-.5)*this.node.width/2:1===e?n=cc.v2(600*(Math.random()-.5),300+300*Math.random()):(i.x=(Math.random()-.5)*this.node.width/2,n=cc.v2(600*(Math.random()-.5)*(e-1),(300+300*Math.random())*(e-1)));var o=t.getComponent("cc.RigidBody");o.linearVelocity=n,o.fixedRotation=!0,t.setPosition(i),this.guaguaCount++},despawnGuagua:function(t){this.guaguaSet.delete(t),this.guaguaPool.put(t)},onMove:function(t){if(this.enabled){var e=this.node.convertToNodeSpaceAR(t.getLocation()).x,i=this.miemie.node.position.y,n=Math.abs(e);this.debugLabel.string=e+"\n"+n+"\n"+this.node.width+"\n"+this.miemie.node.width,n>this.node.width/2-this.miemie.node.width/2&&(n=this.node.width/2-this.miemie.node.width/2),e=e<0?-n:n,this.miemie.node.setPosition(e,i)}},gainScore:function(){this.score+=1,this.scoreLabel.string="Score: "+this.score},loseHealthPoint:function(){this.healthPoint>0&&(this.healthPoint-=1),this.healthPoint<=0&&this.gameOver(),this.healtPointLabel.string="HP: "+this.healthPoint}}),cc._RF.pop()},{Miemie:"Miemie"}],Guagua:[function(t,e,i){"use strict";cc._RF.push(e,"fb9deu0J3NByYMtKZQFnuIr","Guagua"),cc.Class({extends:cc.Component,properties:{catchedFXPrefab:{default:null,type:cc.Prefab},onCatchedAudio:{default:null,type:cc.AudioClip},onMissedAudio:{default:null,type:cc.AudioClip}},onLoad:function(){var t=this.node.getComponent("cc.RigidBody");this.gravityScale=t.gravityScale,this.onCatchFx=null,this.catched=!1},unuse:function(){this.onCatchFx&&(this.onCatchFx.destroy(),this.onCatchFx=null),this.active=!1},reuse:function(){var t=this.node.getChildByName("guagua");t.setPosition(cc.v2(0,0)),t.setScale(1),t.opacity=255,this.catched=!1,this.enablePhysics(),this.active=!0},enablePhysics:function(){this.node.getComponent("cc.PhysicsCollider").active=!0},disablePhysics:function(){this.node.getComponent("cc.PhysicsCollider").active=!1},onCatched:function(){this.game&&(this.disablePhysics(),this.catched||(this.catched=!0,cc.audioEngine.playEffect(this.onCatchedAudio,!1),this.onCatchFx&&(this.onCatchFx.destroy(),this.onCatchFx=null),this.onCatchFx=cc.instantiate(this.catchedFXPrefab),this.node.addChild(this.onCatchFx),this.onCatchFx.setPosition(this.node.position),this.game.gainScore(),this.leave()))},onMissed:function(){this.game&&(this.disablePhysics(),this.catched||(this.catched=!0,cc.audioEngine.playEffect(this.onMissedAudio,!1),this.game.loseHealthPoint(),this.leave()))},leave:function(){var t=this.getComponent(cc.Animation);t.play("leave"),t.on("finished",function(){this.game.despawnGuagua(this.node)},this)}}),cc._RF.pop()},{}],Miemie:[function(t,e,i){"use strict";cc._RF.push(e,"5930aByuuhL1a/U7TmIU0hG","Miemie"),cc.Class({extends:cc.Component,properties:{debugLabel:{default:null,type:cc.Label}},onLoad:function(){this.heartBeatAction=this.setHeartBeatAction(),this.enabled=!1},resetPosition:function(){this.node.x=0},startMove:function(){this.enabled=!0,this.node.runAction(this.heartBeatAction)},stopMove:function(){this.enabled=!1,this.node.stopAllActions()},setHeartBeatAction:function(){var t=cc.scaleTo(.5,1.2,.8).easing(cc.easeCubicActionIn()),e=cc.scaleTo(.5,1,1).easing(cc.easeCircleActionOut());return cc.repeatForever(cc.sequence(t,e))},onBeginContact:function(t,e,i){i.getComponent("Guagua").onCatched()}}),cc._RF.pop()},{}],PhysicsBound:[function(t,e,i){"use strict";cc._RF.push(e,"0e51bbN9D1BsLnAPPIW5bcN","PhysicsBound"),cc.Class({extends:cc.Component,properties:{size:cc.size(0,0),mouseJoint:!0},onLoad:function(){var t=this.size.width||this.node.width,e=this.size.height||this.node.height,i=new cc.Node;(i.addComponent(cc.RigidBody).type=cc.RigidBodyType.Static,this.mouseJoint)&&(i.addComponent(cc.MouseJoint).mouseRegion=this.node);this._addBound(i,0,e/2,t,20),this._addBound(i,0,-e/2,t,20),this._addBound(i,-t/2,0,20,e),this._addBound(i,t/2,0,20,e),i.parent=this.node},start:function(){},_addBound:function(t,e,i,n,o){var s=t.addComponent(cc.PhysicsBoxCollider);s.offset.x=e,s.offset.y=i,s.size.width=n,s.size.height=o}}),cc._RF.pop()},{}],Welcome:[function(t,e,i){"use strict";cc._RF.push(e,"353f628mkJNdL4mKqmPDNyD","Welcome"),cc.Class({extends:cc.Component,properties:{welcomeLabel:{default:null,type:cc.Label},welcomeString:{default:"",multiline:!0},nextButton:{default:null,type:cc.Node}},onLoad:function(){cc.director.preloadScene("game",function(){cc.log("Next scene preloaded")}),this.stringIndex=0,this.stringLength=this.welcomeString.length},start:function(){this.schedule(this.showText,.1)},onNext:function(){cc.director.loadScene("game")},showText:function(){this.stringIndex++,this.welcomeLabel.string=this.welcomeString.substring(0,this.stringIndex),this.stringIndex>this.stringLength&&(this.unschedule(this.showText),this.nextButton.active=!0)}}),cc._RF.pop()},{}]},{},["Ground","GuaMieGame","Guagua","Miemie","PhysicsBound","Welcome"]);