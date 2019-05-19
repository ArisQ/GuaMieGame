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
        size: cc.size(0, 0),
        mouseJoint: true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let width   = this.size.width || this.node.width;
        let height  = this.size.height || this.node.height;

        let node = new cc.Node();

        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        if (this.mouseJoint) {
            // add mouse joint
            let joint = node.addComponent(cc.MouseJoint);
            joint.mouseRegion = this.node;    
        }
        
        this._addBound(node, 0, height/2, width, 20);
        this._addBound(node, 0, -height/2, width, 20);
        this._addBound(node, -width/2, 0, 20, height);
        this._addBound(node, width/2, 0, 20, height);

        node.parent = this.node;
    },

    start () {

    },

    // update (dt) {},
    _addBound (node, x, y, width, height) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    }
});
