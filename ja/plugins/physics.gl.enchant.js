/**
 * @fileOverview
 * physics.gl.enchant.js
 * @version 0.3.6
 * @require enchant.js v0.4.5+
 * @require gl.enchant.js v0.3.6+
 * @require primitive.gl.enchant.js v0.3.5+
 * @require gl-matrix.js 1.3.7+
 * @author Ubiquitous Entertainment Inc.
 *
 * @description
 * ammo.jsを使用している物理演算ライブラリ.
 * gl.enchant.jsで物理演算によって動作するオブジェクトを使えるようにする.
 * @detail
 * ammo.js:
 * https://github.com/kripken/ammo.js
 */
if (typeof Ammo === 'undefined') {
    throw new Error('physics.gl.enchant.js must be loaded after ammo.js');
}
if (enchant.gl !== undefined && enchant.gl.primitive !== undefined) {
    (function() {
        /**
         * namespace object
         * @type {Object}
         */
        enchant.gl.physics = {};
        /**
         * @scope enchant.gl.physics.World.prototype
         */
        enchant.gl.physics.World = enchant.Class.create({
            /**
             * 物理演算が適用される世界.
             * ここに剛体オブジェクトを追加し, 時間を進めることで物理演算が実行される.
             * @see enchant.gl.physics.PhyScene3D
             * @constructs
             */
            initialize: function() {
                var g = new Ammo.btVector3(0, -10, 0);
                var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
                var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
                var pairCache = new Ammo.btDbvtBroadphase();
                var constraintSolver = new Ammo.btSequentialImpulseConstraintSolver();

                this._dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(
                    dispatcher, pairCache, constraintSolver, collisionConfiguration);

                this._dynamicsWorld.setGravity(g);

                Ammo.destroy(g);
            },
            /**
             * Worldの重力を設定する.
             * @param {Number} gx x軸方向の重力.
             * @param {Number} gy y軸方向の重力.
             * @param {Number} gz z軸方向の重力.
             */
            setGravity: function(gx, gy, gz) {
                var g = new Ammo.btVector3(gx, gy, gz);
                this._dynamicsWorld.setGravity(g);
                Ammo.destroy(g);
            },
            /**
             * Worldの時間を進める.
             * timeStepがfixedTimeStepより大きい場合, maxSubStepで指定した回数まで続けて時間を進める.
             * @param {Number} timeStep 進めたい時間.単位は秒.
             * @param {Number} maxSubSteps シミュレーションの最大追加回数.
             * @param {Number} fixedTimeStep 基本となる時間. デフォルト値は1/60.
             * @return {Number} subStepsNum
             */
            stepSimulation: function(timeStep, maxSubSteps, fixedTimeStep) {
                return this._dynamicsWorld.stepSimulation(timeStep, maxSubSteps, fixedTimeStep);
            },
            /**
             * Worldに剛体を追加する.
             * @param {enchant.gl.physics.Rigid} Rigid 追加する剛体オブジェクト.
             */
            addRigid: function(rigid) {
                this._dynamicsWorld.addRigidBody(rigid.rigidBody);
                rigid.world = this;
            },
            /**
             * Worldから剛体を削除する.
             * @param {enchant.gl.physics.Rigid} Rigid 削除する剛体オブジェクト.
             */
            removeRigid: function(rigid) {
                this._dynamicsWorld.removeRigidBody(rigid.rigidBody);
                rigid.world = null;
            },
            /**
             * Rigid同士が衝突しているかを判定する.
             * @param {enchant.gl.physics.Rigid} rigid1 判定するRigid1.
             * @param {enchant.gl.physics.Rigid} rigid2 判定するRigid2.
             * @return {Boolean} bool 衝突の有無.
             */
            contactPairTest: function(rigid1, rigid2) {
                var callback = new Ammo.ConcreteContactResultCallback();
                var result = false;
                Ammo.customizeVTable(callback, [
                    {
                        original: Ammo.ConcreteContactResultCallback.prototype.addSingleResult,
                        replacement: function(tp, cp, colObj0, partid0, index0, colObj1, partid1, index1) {
                            result = true;
                        }
                    }
                ]);
                this._dynamicsWorld.contactPairTest(rigid1.rigidBody, rigid2.rigidBody, callback);
                Ammo.destroy(callback);
                return result;
            }
        });

        /**
         * @scope enchant.gl.physics.Rigid.prototype
         */
        enchant.gl.physics.Rigid = enchant.Class.create({
            /**
             * 剛体オブジェクト.
             * Worldに追加して使用する.
             * @param shape Ammo.btCollisionShapeオブジェクト.
             * @param {Number} mass 剛体の質量.
             * @param {Number} linearDamping 剛体の線形速度の減衰率.
             * @param {Number} angularDamping 剛体の角速度の減衰率.
             * @see enchant.gl.physics.RigidBox
             * @see enchant.gl.physics.RigidCube
             * @see enchant.gl.physics.RigidSphere
             * @see enchant.gl.physics.RigidCylinder
             * @see enchant.gl.physics.RigidCapsule
             * @see enchant.gl.physics.RigidPlane
             * @see enchant.gl.physics.RigidContainer
             * @constructs
             */
            initialize: function(shape, mass, lDamp, aDamp) {
                if (typeof shape === 'undefined') {
                    shape = new Ammo.btBoxShape(1);
                }
                if (typeof mass === 'undefined') {
                    mass = 1;
                }

                var localInertia = new Ammo.btVector3(0, 0, 0);
                shape.calculateLocalInertia(mass, localInertia);

                var transform = new Ammo.btTransform();
                transform.setIdentity();

                var motionState = new Ammo.btDefaultMotionState(transform);
                var rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
                rigidBodyInfo.set_m_restitution(0.1);
                rigidBodyInfo.set_m_friction(3.0);

                if (typeof lDamp !== 'undefined') {
                    rigidBodyInfo.set_m_linearDamping(lDamp);
                }
                if (typeof aDamp !== 'undefined') {
                    rigidBodyInfo.set_m_angularDamping(aDamp);
                }

                this.shape = shape;
                /**
                 * Rigidが所属するWorld
                 */
                this.world = null;

                /**
                 * Ammoの剛体オブジェクト
                 */
                this.rigidBody = new Ammo.btRigidBody(rigidBodyInfo);
                var p = Ammo.getPointer(this.rigidBody);
                enchant.gl.physics.Rigid._refs[p] = this;

                Ammo.destroy(transform);
                Ammo.destroy(localInertia);
                Ammo.destroy(rigidBodyInfo);

                this._x = 0;
                this._y = 0;
                this._z = 0;
                this._scaleX = 1;
                this._scaleY = 1;
                this._scaleZ = 1;
                this._mass = mass;
                this._restitution = 0.3;
                this._friction = 0.3;
            },
            /**
             * Rigidを拡大縮小する.
             * Worldでの現在の拡大率から, 各軸に対して指定された倍率分だけ拡大縮小をする.
             * @param {Number} x x軸方向の拡大率.
             * @param {Number} y y軸方向の拡大率.
             * @param {Number} z z軸方向の拡大率.
             */
            scale: function(x, y, z) {
                this.activate();
                this._scaleX *= x;
                this._scaleY *= y;
                this._scaleZ *= z;
                var sv = new Ammo.btVector3(this._scaleX, this._scaleY, this._scaleZ);
                this.shape.setLocalScaling(sv);
                Ammo.destroy(sv);
            },
            _scaleAxis: function(axis, scale) {
                axis.toUpperCase();
                this['_scale' + axis] = scale;
                var sv = new Ammo.btVector3(this._scaleX, this._scaleY, this._scaleZ);
                this.shape.setLocalScaling(sv);
                Ammo.destroy(sv);
            },
            /**
             * Rigidを平行移動する.
             * Worldでの現在の位置から, 各軸に対して指定された分だけ平行移動をする.
             * @param {Number} x x軸方向の平行移動量.
             * @param {Number} y y軸方向の平行移動量.
             * @param {Number} z z軸方向の平行移動量.
             */
            translate: function(x, y, z) {
                this.activate();
                var vec = new Ammo.btVector3(x, y, z);
                this.rigidBody.translate(vec);
                Ammo.destroy(vec);
                this._x += x;
                this._y += y;
                this._z += z;
            },
            _translateAxis: function(axis, n) {
                this.activate();
                var x = 0;
                var y = 0;
                var z = 0;
                if (axis === 'x') {
                    x = n - this._x;
                    this._x = n;
                } else if (axis === 'y') {
                    y = n - this._y;
                    this._y = n;
                } else if (axis === 'z') {
                    z = n - this._z;
                    this._z = n;
                }
                var vec = new Ammo.btVector3(x, y, z);
                this.rigidBody.translate(vec);
                Ammo.destroy(vec);
            },
            /**
             * クォータニオンで表した姿勢をRigidにセットする.
             * @param {enchant.gl.Quat} quat
             */
            rotationSet: function(quat) {
                var qq = quat._quat;
                var q = new Ammo.btQuaternion(qq[0], qq[1], qq[2], qq[3]);
                var t = this._getTransform();
                t.setRotation(q);
                this.rigidBody.setWorldTransform(t);
                Ammo.destroy(q);
                Ammo.destroy(t);
            },
            /**
             * クォータニオンで表した回転をRigidに適用する.
             * @param {enchant.gl.Quat} quat
             */
            rotationApply: function(quat) {
                var quat1 = quat._quat;
                var t = this._getTransform();
                var qq = t.getRotation();
                var quat2 = quat4.create([qq.x(), qq.y(), qq.z(), qq.w()]);
                quat4.multiply(quat2, quat1, quat2);
                var q = new Ammo.btQuaternion(quat2[0], quat2[1], quat2[2], quat2[3]);
                t.setRotation(q);
                this.rigidBody.setWorldTransform(t);
                Ammo.destroy(q);
                Ammo.destroy(t);
            },
            /**
             * Rigidを止める.
             */
            clearForces: function() {
                var vec0 = new Ammo.btVector3(0, 0, 0);
                this.rigidBody.setLinearVelocity(vec0);
                this.rigidBody.setAngularVelocity(vec0);
                this.rigidBody.clearForces();
                Ammo.destroy(vec0);
            },
            /**
             * 他のRigidとの衝突判定.
             * @param {enchant.gl.physics.Rigid} rigid 判定するRigid.
             * @return {Boolean} bool 衝突の有無.
             */
            contactTest: function(rigid) {
                if (this.world && rigid.world &&
                    this.world === rigid.world) {
                    return this.world.contactPairTest(this, rigid);
                } else {
                    return false;
                }
            },
            /**
             * Rigidを有効化する.
             * @param {Boolean} force 強制的に有効化する.
             */
            activate: function(force) {
                this.rigidBody.activate(force);
            },
            /**
             * Rigidに力を加える.
             * 力はRigidの中心に加えられる.
             * @param {Number} powerX x軸方向の力.
             * @param {Number} powerY y軸方向の力.
             * @param {Number} powerZ z軸方向の力.
             */
            applyCentralImpulse: function(powx, powy, powz) {
                var powv = new Ammo.btVector3(powx, powy, powz);
                this.activate();
                this.rigidBody.applyCentralImpulse(powv);
                Ammo.destroy(powv);
            },
            /**
             * Rigidに力を加える.
             * 力は指定した位置に加えられる.
             * @param {Number} powerX x軸方向の力.
             * @param {Number} powerY y軸方向の力.
             * @param {Number} powerZ z軸方向の力.
             * @param {Number} positonX 力を加える位置のx座標.
             * @param {Number} positonY 力を加える位置のy座標.
             * @param {Number} positonZ 力を加える位置のz座標.
             */
            applyImpulse: function(powx, powy, powz, posx, posy, posz) {
                var powv = new Ammo.btVector3(powx, powy, powz);
                var posv = new Ammo.btVector3(posx, posy, posz);
                this.activate();
                this.rigidBody.applyImpulse(powv, posv);
                Ammo.destroy(powv);
                Ammo.destroy(posv);
            },
            _getTransform: function() {
                return this.rigidBody.getWorldTransform();
            },
            /**
             * Rigidをユーザが動かすためのオブジェクトとして設定する.
             */
            kinematize: function() {
                var flag = this.rigidBody.getCollisionFlags();
                this.rigidBody.setCollisionFlags(flag | 2);
                this.rigidBody.setActivationState(4);
            },
            /**
             * Rigidの反発係数.
             * @type Number
             */
            restitution: {
                get: function() {
                    return this._restitution;
                },
                set: function(n) {
                    this._restitution = n;
                    this.rigidBody.setRestitution(n);
                }
            },
            /**
             * Rigidの摩擦係数.
             * @type Number
             */
            friction: {
                get: function() {
                    return this._friction;
                },
                set: function(n) {
                    this._friction = n;
                    this.rigidBody.setFriction(n);
                }
            }
        });
        enchant.gl.physics.Rigid._refs = {};

        /**
         * @scope enchant.gl.physics.RigidBox.prototype
         */
        enchant.gl.physics.RigidBox = enchant.Class.create(enchant.gl.physics.Rigid, {
            /**
             * 直方体型の剛体オブジェクト.
             * @param {Number} scaleX 直方体の中心からx軸に垂直な面までの距離.
             * @param {Number} scaleY 直方体の中心からy軸に垂直な面までの距離.
             * @param {Number} scaleZ 直方体の中心からz軸に垂直な面までの距離.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.Rigid
             * @see enchant.gl.physics.PhyBox
             * @constructs
             * @extends enchant.gl.physics.Rigid
             */
            initialize: function(sx, sy, sz, mass) {
                var scale = new Ammo.btVector3(sx, sy, sz);
                var shape = new Ammo.btBoxShape(scale);
                enchant.gl.physics.Rigid.call(this, shape, mass);
                Ammo.destroy(scale);
            }
        });
        /**
         * @scope enchant.gl.physics.RigidCube.prototype
         */
        enchant.gl.physics.RigidCube = enchant.Class.create(enchant.gl.physics.RigidBox, {
            /**
             * 立方体型の剛体オブジェクト.
             * @param {Number} scale 箱の中心から面までの距離.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.PhyCube
             * @constructs
             * @see enchant.gl.physics.Rigid
             * @extends enchant.gl.physics.PhyCube
             */
            initialize: function(scale, mass) {
                enchant.gl.physics.RigidBox.call(this, scale, scale, scale, mass);
            }
        });

        /**
         * @scope enchant.gl.physics.RigidSphere.prototype
         */
        enchant.gl.physics.RigidSphere = enchant.Class.create(enchant.gl.physics.Rigid, {
            /**
             * 球体型の剛体オブジェクト.
             * @param {Number} radius 球体の半径.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.Rigid
             * @see enchant.gl.physics.PhySphere
             * @constructs
             * @extends enchant.gl.physics.Rigid
             */
            initialize: function(s, mass, lDamp, aDamp) {
                var shape = new Ammo.btSphereShape(s);
                enchant.gl.physics.Rigid.call(this, shape, mass, lDamp, aDamp);
            }
        });

        /**
         * @scope enchant.gl.physics.RigidCylinder.prototype
         */
        enchant.gl.physics.RigidCylinder = enchant.Class.create(enchant.gl.physics.Rigid, {
            /**
             * 円柱型の剛体オブジェクト.
             * @param {Number} radius 円柱の半径.
             * @param {Number} height 円柱の高さ.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.Rigid
             * @see enchant.gl.physics.PhyCylinder
             * @constructs
             * @extends enchant.gl.physics.Rigid
             */
            initialize: function(r, h, mass) {
                var scale = new Ammo.btVector3(r, h, r);
                var shape = new Ammo.btCylinderShape(scale);
                enchant.gl.physics.Rigid.call(this, shape, mass);
                Ammo.destroy(scale);
            }
        });

        /**
         * @scope enchant.gl.physics.RigidCapsule.prototype
         */
        enchant.gl.physics.RigidCapsule = enchant.Class.create(enchant.gl.physics.Rigid, {
            /**
             * カプセル型の剛体オブジェクト.
             * y軸に沿う円柱の両端に半球をつけた形状.
             * @param {Number} radius 半球体の半径.
             * @param {Number} height 円柱の高さの半分.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.Rigid
             * @see enchant.gl.physics.PhyCapsule
             * @constructs
             * @extends enchant.gl.physics.Rigid
             */
            initialize: function(r, h, mass) {
                var shape = new Ammo.btCapsuleShape(r, h);
                enchant.gl.physics.Rigid.call(this, shape, mass);
            }
        });

        /**
         * @scope enchant.gl.physics.RigidPlane.prototype
         */
        enchant.gl.physics.RigidPlane = enchant.Class.create(enchant.gl.physics.Rigid, {
            /**
             * 無限平面型の剛体オブジェクト.
             * @param {Number} NormalX 平面の法線ベクトルのx成分.
             * @param {Number} NormalY 平面の法線ベクトルのy成分.
             * @param {Number} NormalZ 平面の法線ベクトルのz成分.
             * @see enchant.gl.physics.Rigid
             * @see enchant.gl.physics.PhyPlane
             * @constructs
             * @extends enchant.gl.physics.Rigid
             */
            initialize: function(nx, ny, nz, distance) {
                var normal = new Ammo.btVector3(nx, ny, nz);
                var shape = new Ammo.btStaticPlaneShape(normal, distance);
                enchant.gl.physics.Rigid.call(this, shape, 0);
                Ammo.destroy(normal);
            }
        });

        /**
         * @scope enchant.gl.physics.RigidContainer.prototype
         */
        enchant.gl.physics.RigidContainer = enchant.Class.create(enchant.gl.physics.Rigid, {
            /**
             * 枡型の剛体オブジェクト.
             * @param {Number} scale 枡の中心から枠までの距離.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.Rigid
             * @see enchant.gl.physics.PhyContainer
             * @constructs
             * @extends enchant.gl.physics.Rigid
             */
            initialize: function(s, mass) {
                var shape = new Ammo.btCompoundShape(s);
                var addWall = function(sx, sy, sz, px, py, pz) {
                    var sc = new Ammo.btVector3(sx, sy, sz);
                    var tr = new Ammo.btTransform();
                    tr.setIdentity();
                    var or = new Ammo.btVector3(px, py, pz);
                    tr.setOrigin(or);
                    var shp = new Ammo.btBoxShape(sc);
                    shape.addChildShape(tr, shp);
                    Ammo.destroy(sc);
                    Ammo.destroy(or);
                    Ammo.destroy(tr);
                };
                addWall(s, s / 8, s, 0, s / 8 - s, 0);
                addWall(s - s / 8, s - s / 8 - s / 8, s / 8, s / 8, 0, s / 8 - s);
                addWall(s - s / 8, s - s / 8 - s / 8, s / 8, -s / 8, 0, s - s / 8);
                addWall(s / 8, s - s / 8 - s / 8, s - s / 8, s / 8 - s, 0, -s / 8);
                addWall(s / 8, s - s / 8 - s / 8, s - s / 8, s - s / 8, 0, s / 8);
                enchant.gl.physics.Rigid.call(this, shape, mass);
            }
        });

        /**
         * @scope enchant.gl.physics.PhyScene3D.prototype
         */
        enchant.gl.physics.PhyScene3D = enchant.Class.create(enchant.gl.Scene3D, {
            /**
             * Worldを持つScene3D.
             * 時間を進めることで, addChildされたSprite3Dに物理演算が適用される.
             * @see enchant.gl.physics.World
             * @constructs
             * @extends enchant.gl.Scene3D
             */
            initialize: function() {
                enchant.gl.Scene3D.call(this);
                var core = enchant.Core.instance;
                this.world = new enchant.gl.physics.World();
                this.isPlaying = false;
                this.timeStep = 1 / core.fps;
                this.maxSubSteps = 1;
                this.fixedTimeStep = 1 / 60;
                var that = this;
                this._stepping = function() {
                    that.stepSimulation(that.timeStep, that.maxSubSteps, that.fixedTimeStep);
                };
            },
            /**
             * 子Sprite3Dを追加する.
             * PhySprite3Dを追加した場合, PhySprite3Dが持つ剛体オブジェクトがPhyScene3Dが持つWorldに追加される.
             * @param {enchant.gl.Sprite3D|enchant.gl.physics.PhySprite3D} Sprite3D 追加する子Sprite3D.
             */
            addChild: function(sprite) {
                enchant.gl.Scene3D.prototype.addChild.call(this, sprite);
                if (sprite instanceof enchant.gl.physics.PhySprite3D) {
                    this.world.addRigid(sprite.rigid);
                }
            },
            /**
             * 指定された子Sprite3Dを削除する.
             * PhySprite3Dを指定した場合, PhySprite3Dが持つ剛体オブジェクトがPhyScene3Dが持つWorldから削除される.
             * @param {enchant.gl.Sprite3D|enchant.gl.physics.PhySprite3D} Sprite3D 追加する子Sprite3D.
             */
            removeChild: function(sprite) {
                enchant.gl.Scene3D.prototype.removeChild.call(this, sprite);
                if (sprite instanceof enchant.gl.physics.PhySprite3D) {
                    this.world.removeRigid(sprite.rigid);
                }
            },
            /**
             * PhyScene3Dが持つWorldの重力を設定する。
             * @param {Number} gx x軸方向の重力
             * @param {Number} gy y軸方向の重力
             * @param {Number} gz z軸方向の重力
             */
            setGravity: function(x, y, z) {
                this.world.setGravity(x, y, z);
            },
            /**
             * PhySprite3Dが持つWorldの時間を進める.
             * @param {Number} timeStep 進めたい時間.単位は秒.
             * @param {Number} maxSubSteps
             * @param {Number} fixedTimeStep
             */
            stepSimulation: function(timeStep, maxSubSteps, fixedTimeStep) {
                var subStep = this.world.stepSimulation(timeStep, maxSubSteps, fixedTimeStep);
                var e = new enchant.Event('timestep');
                e.timeStep = timeStep;
                e.subStep = subStep;
                this.dispatchEvent(e);
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    if (this.childNodes[i] instanceof enchant.gl.physics.PhySprite3D) {
                        this.childNodes[i].dispatchEvent(e);
                    }
                }
            },
            /**
             * Worldの時間の進行を始める.
             * enterframeごとにstepSimulationが自動で呼び出される.
             */
            play: function() {
                var core = enchant.Core.instance;
                if (!this.isPlaying) {
                    this.isPlaying = true;
                    core.addEventListener('enterframe', this._stepping);
                }
            },
            /**
             * Worldの時間の進行を止める.
             */
            stop: function() {
                var core = enchant.Core.instance;
                this.isPlaying = false;
                core.removeEventListener('enterframe', this._stepping);
            }
        });

        /**
         * @scope enchant.gl.physics.PhySprite3D.prototype
         */
        enchant.gl.physics.PhySprite3D = enchant.Class.create(enchant.gl.Sprite3D, {
            /**
             * 物理スプライト.
             * PhySprite3Dに追加すると, stepSimulationを呼び出した際に物理演算が適用される.
             * @param {enchant.gl.physics.Rigid} rigid
             * @see enchant.gl.physics.PhyBox
             * @see enchant.gl.physics.PhyCube
             * @see enchant.gl.physics.PhySphere
             * @see enchant.gl.physics.PhyCylinder
             * @see enchant.gl.physics.PhyCapsule
             * @see enchant.gl.physics.PhyPlane
             * @see enchant.gl.physics.PhyContainer
             * @constructs
             */
            initialize: function(rigid) {
                enchant.gl.Sprite3D.call(this);
                this.rigid = rigid;

                this.addEventListener('timestep', function() {
                    var t = this.rigid._getTransform();
                    var o = t.getOrigin();
                    var q = t.getRotation();
                    this._x = this.rigid._x = o.x();
                    this._y = this.rigid._y = o.y();
                    this._z = this.rigid._z = o.z();
                    this._changedTranslation = true;
                    var a = [ q.x(), q.y(), q.z(), q.w() ];
                    var quat = quat4.create(a);
                    quat4.toMat4(quat, this.rotation);
                    Ammo.destroy(t);
                });
            },
            /**
             * PhySprite3Dを拡大縮小する.
             * 表示上の拡大率とWorldでの拡大率が同時に変更される.
             * @param {Number} x x軸方向の拡大率.
             * @param {Number} y y軸方向の拡大率.
             * @param {Number} z z軸方向の拡大率.
             */
            scale: function(x, y, z) {
                enchant.gl.Sprite3D.prototype.scale.call(this, x, y, z);
                this.rigid.scale(x, y, z);
            },
            /**
             * PhySprite3Dを平行移動する.
             * 表示上の位置とWorldでの位置が変更される.
             * @param {Number} x x軸方向の平行移動量.
             * @param {Number} y y軸方向の平行移動量.
             * @param {Number} z z軸方向の平行移動量.
             */
            translate: function(x, y, z) {
                enchant.gl.Sprite3D.prototype.translate.call(this, x, y, z);
                this.rigid.translate(x, y, z);
            },
            /**
             * 回転行列にクォータニオンから得られる回転行列をセットする.
             * Worldでの姿勢も変更される.
             * @param {enchant.gl.Quat} quat
             */
            rotationSet: function(quat) {
                enchant.gl.Sprite3D.prototype.rotationSet.call(this, quat);
                this.rigid.rotationSet(quat);
            },
            /**
             * 回転行列にクォータニオンから得られる回転行列を適用する.
             * Worldでの姿勢も変更される.
             * @param {enchant.gl.Quat} quat
             */
            rotationApply: function(quat) {
                enchant.gl.Sprite3D.prototype.rotationApply.call(this, quat);
                this.rigid.rotationApply(quat);
            },
            /**
             * Rigidを止める.
             * Stops Rigid object.
             */
            clearForces: function() {
                this.rigid.clearForces();
            },
            /**
             * 他のPhySprite3Dとの衝突判定.
             * @param {enchant.gl.physics.PhySprite3D} sprite 判定するPhySprite3D.
             * @return {Boolean} bool 衝突の有無.
             */
            contactTest: function(sprite) {
                return this.rigid.contactTest(sprite.rigid);
            },
            /**
             * 剛体に力を加える.
             * 力は剛体の中心に加えられる.
             * @param {Number} powerX x軸方向の力.
             * @param {Number} powerY y軸方向の力.
             * @param {Number} powerZ z軸方向の力.
             * @see enchant.gl.physics.Rigid#applyCentralImpulse
             */
            applyCentralImpulse: function(powx, powy, powz) {
                this.rigid.applyCentralImpulse(powx, powy, powz);
            },
            /**
             * 剛体に力を加える.
             * 力は指定した位置に加えられる.
             * @param {Number} powerX x軸方向の力.
             * @param {Number} powerY y軸方向の力.
             * @param {Number} powerZ z軸方向の力.
             * @param {Number} positonX 力を加える位置のx座標.
             * @param {Number} positonY 力を加える位置のy座標.
             * @param {Number} positonZ 力を加える位置のz座標.
             * @see enchant.gl.physics.Rigid#applyImpulse
             */
            applyImpulse: function(powx, powy, powz, posx, posy, posz) {
                this.rigid.applyImpulse(powx, powy, powz, posx, posy, posz);
            },
            /**
             * PhySprite3Dをユーザが動かすためのオブジェクトとして設定する.
             */
            kinematize: function() {
                this.rigid.kinematize();
            },
            /**
             * PhySprite3Dの反発係数.
             * @type Number
             * @see enchant.gl.physics.Rigid#restitution
             */
            restitution: {
                get: function() {
                    return this.rigid._restitution;
                },
                set: function(n) {
                    this.rigid._restitution = n;
                    this.rigid.rigidBody.setRestitution(n);
                }
            },
            /**
             * PhySprite3Dの摩擦係数.
             * @type Number
             * @see enchant.gl.physics.Rigid#friction
             */
            friction: {
                get: function() {
                    return this.rigid._friction;
                },
                set: function(n) {
                    this.rigid._friction = n;
                    this.rigid.rigidBody.setFriction(n);
                }
            }
        });
        'x y z'.split(' ').forEach(function(prop) {
            Object.defineProperty(enchant.gl.physics.PhySprite3D.prototype, prop, {
                get: function() {
                    return this['_' + prop];
                },
                set: function(n) {
                    this['_' + prop] = n;
                    this._changedTranslation = true;
                    this.rigid._translateAxis(prop, n);
                }
            });
        });
        'scaleX scaleY scaleZ'.split(' ').forEach(function(prop) {
            Object.defineProperty(enchant.gl.physics.PhySprite3D.prototype, prop, {
                get: function() {
                    return this['_' + prop];
                },
                set: function(scale) {
                    this['_' + prop] = scale;
                    this._changedScale = true;
                    this.rigid._scaleAxis(prop, scale);
                }
            });
        });

        /**
         * @scope enchant.gl.physics.PhyBox.prototype
         */
        enchant.gl.physics.PhyBox = enchant.Class.create(enchant.gl.physics.PhySprite3D, {
            /**
             * 直方体型のPhySprite3D.
             * PhySprite3Dに追加すると, stepSimulationを呼び出した際に物理演算が適用される.
             * @param {Number} scaleX 直方体の中心からx軸に垂直な面までの距離.
             * @param {Number} scaleY 直方体の中心からy軸に垂直な面までの距離.
             * @param {Number} scaleZ 直方体の中心からz軸に垂直な面までの距離.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.PhySprite3D
             * @see enchant.gl.physics.PhyScene3D
             * @constructs
             * @extends enchant.gl.physics.PhySprite3D
             */
            initialize: function(sx, sy, sz, mass) {
                var rigid = new enchant.gl.physics.RigidBox(sx, sy, sz, mass);
                enchant.gl.physics.PhySprite3D.call(this, rigid);
                this.mesh = enchant.gl.Mesh.createBox(sx, sy, sz);
            }
        });

        /**
         * @scope enchant.gl.physics.PhyCube.prototype
         */
        enchant.gl.physics.PhyCube = enchant.Class.create(enchant.gl.physics.PhyBox, {
            /**
             * 立方体型のPhySprite3D.
             * PhySprite3Dに追加すると, stepSimulationを呼び出した際に物理演算が適用される.
             * @param {Number} scale 箱の中心から面までの距離.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.PhySprite3D
             * @see enchant.gl.physics.PhyScene3D
             * @constructs
             * @extends enchant.gl.physics.PhyBox
             */
            initialize: function(s, mass) {
                var rigid = new enchant.gl.physics.RigidBox(s, s, s, mass);
                enchant.gl.physics.PhySprite3D.call(this, rigid);
                this.mesh = enchant.gl.Mesh.createBox(s, s, s);
            }
        });

        /**
         * @scope enchant.gl.physics.PhySphere.prototype
         */
        enchant.gl.physics.PhySphere = enchant.Class.create(enchant.gl.physics.PhySprite3D, {
            /**
             * 球体型のPhySprite3D.
             * PhySprite3Dに追加すると, stepSimulationを呼び出した際に物理演算が適用される.
             * @param {Number} radius 球体の半径.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.PhySprite3D
             * @see enchant.gl.physics.PhyScene3D
             * @constructs
             * @extends enchant.gl.physics.PhySprite3D
             */
            initialize: function(r, mass, lDamp, aDamp) {
                if (typeof lDamp === 'undefined') {
                    lDamp = 0.05;
                }
                if (typeof aDamp === 'undefined') {
                    aDamp = 0.05;
                }
                var rigid = new enchant.gl.physics.RigidSphere(r, mass, lDamp, aDamp);
                enchant.gl.physics.PhySprite3D.call(this, rigid);
                this.mesh = enchant.gl.Mesh.createSphere(r);
                this.addEventListener('timestep', function(e) {
                    this.rigid.rigidBody.applyDamping(e.timeStep);
                });
            }
        });

        /**
         * @scope enchant.gl.physics.PhyCylinder.prototype
         */
        enchant.gl.physics.PhyCylinder = enchant.Class.create(enchant.gl.physics.PhySprite3D, {
            /**
             * 円柱型のPhySprite3D.
             * PhySprite3Dに追加すると, stepSimulationを呼び出した際に物理演算が適用される.
             * @param {Number} radius 円柱の半径.
             * @param {Number} height 円柱の高さ.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.PhySprite3D
             * @see enchant.gl.physics.PhyScene3D
             * @constructs
             * @extends enchant.gl.physics.PhySprite3D
             */
            initialize: function(r, h, mass) {
                var rigid = new enchant.gl.physics.RigidCylinder(r, h, mass);
                enchant.gl.physics.PhySprite3D.call(this, rigid);
                this.mesh = enchant.gl.Mesh.createCylinder(r, h);
            }
        });

        /**
         * @scope enchant.gl.physics.PhyCapsule.prototype
         */
        enchant.gl.physics.PhyCapsule = enchant.Class.create(enchant.gl.physics.PhySprite3D, {
            /**
             * カプセル型のPhySprite3D.
             * y軸に沿う円柱の両端に半球をつけた形状.
             * PhySprite3Dに追加すると, stepSimulationを呼び出した際に物理演算が適用される.
             * @param {Number} radius 半球体の半径.
             * @param {Number} height 円柱の高さの半分.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.PhySprite3D
             * @see enchant.gl.physics.PhyScene3D
             * @constructs
             * @extends enchant.gl.physics.PhySprite3D
             */
            initialize: function(r, h, mass) {
                var rigid = new enchant.gl.physics.RigidCapsule(r, h, mass);
                enchant.gl.physics.PhySprite3D.call(this, rigid);
                this.mesh = enchant.gl.Mesh.createCylinder(r, h);
                this.mesh._join(enchant.gl.Mesh.createSphere(r), 0, h, 0);
                this.mesh._join(enchant.gl.Mesh.createSphere(r), 0, -h, 0);
            }
        });

        /**
         * @scope enchant.gl.physics.PhyPlane.prototype
         */
        enchant.gl.physics.PhyPlane = enchant.Class.create(enchant.gl.physics.PhySprite3D, {
            /**
             * 無限平面型のPhySprite3D.
             * PhySprite3Dに追加すると, stepSimulationを呼び出した際に物理演算が適用される.
             * @param {Number} NormalX 平面の法線ベクトルのx成分.
             * @param {Number} NormalY 平面の法線ベクトルのy成分.
             * @param {Number} NormalZ 平面の法線ベクトルのz成分.
             * @see enchant.gl.physics.PhySprite3D
             * @see enchant.gl.physics.PhyScene3D
             * @constructs
             * @extends enchant.gl.physics.PhySprite3D
             */
            initialize: function(nx, ny, nz, dist, scale) {
                if (!scale) {
                    scale = 50;
                }

                var rigid = new enchant.gl.physics.RigidPlane(nx, ny, nz, dist);
                enchant.gl.physics.PhySprite3D.call(this, rigid);
                this.mesh = enchant.gl.Mesh.createPlaneXZ(scale);
                var up = vec3.create([0, 1, 0]);
                var norm = vec3.create([nx, ny, nz]);
                var axis = vec3.create();
                vec3.cross(up, norm, axis);
                var rad = Math.acos(vec3.dot(up, norm) / (vec3.length(up) * vec3.length(norm)));
                var q = new enchant.gl.Quat(axis[0], axis[1], axis[2], rad);
                var vertices = [];
                for (var i = 0, l = this.mesh.vertices.length; i < l; i += 3) {
                    var x = this.mesh.vertices[i];
                    var y = this.mesh.vertices[i + 1];
                    var z = this.mesh.vertices[i + 2];
                    var arr = q.multiplyVec3([x, y, z]);
                    vertices.push(arr[0] + nx * dist);
                    vertices.push(arr[1] + ny * dist);
                    vertices.push(arr[2] + nz * dist);
                }
                this.mesh.vertices = vertices;
            }
        });

        /**
         * @scope enchant.gl.physics.PhyContainer.prototype
         */
        enchant.gl.physics.PhyContainer = enchant.Class.create(enchant.gl.physics.PhySprite3D, {
            /**
             * 枡型のPhySprite3D.
             * PhySprite3Dに追加すると, stepSimulationを呼び出した際に物理演算が適用される.
             * @param {Number} scale 枡の中心から枠までの距離.
             * @param {Number} mass 剛体の質量.
             * @see enchant.gl.physics.PhySprite3D
             * @see enchant.gl.physics.PhyScene3D
             * @constructs
             * @extends enchant.gl.physics.PhySprite3D
             */
            initialize: function(scale, mass) {
                var s = scale;
                var rigid = new enchant.gl.physics.RigidContainer(s, mass);
                enchant.gl.physics.PhySprite3D.call(this, rigid);
                var that = this;
                this.mesh = new enchant.gl.Mesh();
                var addWall = function(sx, sy, sz, px, py, pz) {
                    that.mesh._join(enchant.gl.Mesh.createBox(sx, sy, sz), px, py, pz);
                };
                addWall(s, s / 8, s, 0, s / 8 - s, 0);
                addWall(s - s / 8, s - s / 8 - s / 8, s / 8, s / 8, 0, s / 8 - s);
                addWall(s - s / 8, s - s / 8 - s / 8, s / 8, -s / 8, 0, s - s / 8);
                addWall(s / 8, s - s / 8 - s / 8, s - s / 8, s / 8 - s, 0, -s / 8);
                addWall(s / 8, s - s / 8 - s / 8, s - s / 8, s - s / 8, 0, s / 8);
            }

        });
    }());
}
