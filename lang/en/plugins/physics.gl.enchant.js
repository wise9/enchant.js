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
 * Physical calculation library using ammo.js
 * Allows object movement using the gl.enchant.js physical calculator.
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
             * World in which physical calculator is used.
             * Here we add a rigid object, and by proceeding forward in time physical calculation will be processed.
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
             * Set gravity of World.
             * @param {Number} gx x axis gravity.
             * @param {Number} gy y axis gravity.
             * @param {Number} gz z axis gravity.
             */
            setGravity: function(gx, gy, gz) {
                var g = new Ammo.btVector3(gx, gy, gz);
                this._dynamicsWorld.setGravity(g);
                Ammo.destroy(g);
            },
            /**
             * Continue World time.
             * When timeStep is bigger than fixedTimeStep, you continue the number of times set in maxSubStep and continue with time.
             * @param {Number} Amount of time you wish to proceed. Units are in seconds.
             * @param {Number} maxSubSteps Maximum number of repetitions to be added to simulation.
             * @param {Number} fixedTimeStep Standard time. The default level is 1/60.
             * @return {Number} subStepsNum
             */
            stepSimulation: function(timeStep, maxSubSteps, fixedTimeStep) {
                return this._dynamicsWorld.stepSimulation(timeStep, maxSubSteps, fixedTimeStep);
            },
            /**
             * Add rigid body to World.
             * @param {enchant.gl.physics.Rigid} Rigid Rigid body object to be added.
             */
            addRigid: function(rigid) {
                this._dynamicsWorld.addRigidBody(rigid.rigidBody);
                rigid.world = this;
            },
            /**
             * Delete rigid body form world.
             * @param {enchant.gl.physics.Rigid} Rigid Rigid body to be deleted.
             */
            removeRigid: function(rigid) {
                this._dynamicsWorld.removeRigidBody(rigid.rigidBody);
                rigid.world = null;
            },
            /**
             * Judges whether or not two rigid objects have collided.
             * @param {enchant.gl.physics.Rigid} rigid1 Rigid1 to be judged.
             * @param {enchant.gl.physics.Rigid} rigid2 Rigid2 to be judged.
             * @return {Boolean} bool Collison presence or absence.
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
             * Rigid body object.
             * Add to World and activate.
             * @param shape Ammo.btCollisionShape object.
             * @param {Number} mass Mass of rigid object.
             * @param {Number} linearDamping Rate of decay of speed on straight line speed of rigid object.
             * @param {Number} angularDamping Rate of decay of angled speed of rigid object.
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
                 * World that Rigid belongs to
                 */
                this.world = null;

                /**
                 * Ammo rigid body object
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
             * Expand and contract Rigid.
             * Expand or contract each axis the designated amount from the current rate of expansion in World.
             * @param {Number} x Rate of expansion on x axis.
             * @param {Number} y Rate of expansion on y axis.
             * @param {Number} z Rate of expansion on z axis.
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
             * Move Rigid in a parallel direciton.
             * Move the designated amount in a parallel direction along each axis from the current World position.
             * @param {Number} x Amount of parallel movement along x axis.
             * @param {Number} y Amount of parallel movement along y axis.
             * @param {Number} z Amount of parallel movement along z axis.
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
             * Set posture expressed in quaternion in Rigid.
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
             * Applies rotation expressed in quaternion to Rigid.
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
             * Stops Rigid object.
             */
            clearForces: function() {
                var vec0 = new Ammo.btVector3(0, 0, 0);
                this.rigidBody.setLinearVelocity(vec0);
                this.rigidBody.setAngularVelocity(vec0);
                this.rigidBody.clearForces();
                Ammo.destroy(vec0);
            },
            /**
             * Collision detection with another Rigid object.
             * @param {enchant.gl.physics.Rigid} rigid Rigid to be judged.
             * @return {Boolean} bool Presence or absence of rigid.
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
             * Make Rigid valid.
             * @param {Boolean} force Forcibly make valid.
             */
            activate: function(force) {
                this.rigidBody.activate(force);
            },
            /**
             * Add power to Rigid.
             * Power is added to the center of Rigid.
             * @param {Number} powerX Power in x axis.
             * @param {Number} powerY Power in y axis.
             * @param {Number} powerZ Power in z axis.
             */
            applyCentralImpulse: function(powx, powy, powz) {
                var powv = new Ammo.btVector3(powx, powy, powz);
                this.activate();
                this.rigidBody.applyCentralImpulse(powv);
                Ammo.destroy(powv);
            },
            /**
             * Add power to Rigid.
             * Power is added to the specified position.
             * @param {Number} powerX x axis power.
             * @param {Number} powerY y axis power.
             * @param {Number} powerZ z axis power.
             * @param {Number} positonX Coordinate on x axis to add power to.
             * @param {Number} positonY Coordinate on y axis to add power to.
             * @param {Number} positonZ Coordinate on z axis to add power to.
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
             * Kinematize Rigid.
             */
            kinematize: function() {
                var flag = this.rigidBody.getCollisionFlags();
                this.rigidBody.setCollisionFlags(flag | 2);
                this.rigidBody.setActivationState(4);
            },
            /**
             * Rigid restitutions.
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
             * Rigid frictions.
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
             * Rectangular solid rigid body object.
             * @param {Number} scaleX Vertical distance along the x axis from rectangular body's center.
             * @param {Number} scaleY Vertical distance along the y axis from rectangular body's center.
             * @param {Number} scaleZ Vertical distance along the z axis from rectangular body's center.
             * @param {Number} mass Rigid body's mass.
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
             * Rectangular solid rigid object.
             * @param {Number} scale Distance between center of box and surface.
             * @param {Number} mass Rigid body mass.
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
             * Spherical rigid object.
             * @param {Number} radius Sphere radius.
             * @param {Number} mass Rigid body mass.
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
             * Cylindrical rigid object.
             * @param {Number} radius Cylinder radius.
             * @param {Number} height Cylinder height.
             * @param {Number} mass Rigid object mass.
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
             * Capsule-shaped rigid object.
             * A shape with a cylinder running along the y axis and hemispheres at both ends.
             * @param {Number} radius Hemisphere radius.
             * @param {Number} height Half the height of the cylinder.
             * @param {Number} mass Mass of the rigid object.
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
             * Infinite level surface rigid body object.
             * @param {Number} NormalX Level surface normal vector x component.
             * @param {Number} NormalY Level surface normal vector y component.
             * @param {Number} NormalZ Level surface normal vector z component.
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
             * Box shape solid object.
             * @param {Number} scale Distance between center of box to border.
             * @param {Number} mass Mass of rigid object.
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
             * Scene3D containing World.
             * As time passes, physical calculation will be applied to the Sprite3D effected by addChild.
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
             * Add child Sprite3D.
             * When adding PhySprite3D, the rigid body object containing PhySprite3D will be added to the World containing PhyScene3D.
             * @param {enchant.gl.Sprite3D|enchant.gl.physics.PhySprite3D} Sprite3D Child Sprite3D to be added.
             */
            addChild: function(sprite) {
                enchant.gl.Scene3D.prototype.addChild.call(this, sprite);
                if (sprite instanceof enchant.gl.physics.PhySprite3D) {
                    this.world.addRigid(sprite.rigid);
                }
            },
            /**
             * Delete designated child Sprite3D.
             * When PhySprite3D is set, the rigid body object containing PhySprite3D will be deleted from the World containing PhyScene3D.
             * @param {enchant.gl.Sprite3D|enchant.gl.physics.PhySprite3D} Sprite3D 追加する子Sprite3D.
             */
            removeChild: function(sprite) {
                enchant.gl.Scene3D.prototype.removeChild.call(this, sprite);
                if (sprite instanceof enchant.gl.physics.PhySprite3D) {
                    this.world.removeRigid(sprite.rigid);
                }
            },
            /**
             * Set the gravity of World containing PhyScene3D.
             * @param {Number} gx x axis gravity
             * @param {Number} gy y axis gravity
             * @param {Number} gz z axis gravity
             */
            setGravity: function(x, y, z) {
                this.world.setGravity(x, y, z);
            },
            /**
             * Proceed forward in time for World containing PhySprite3D.
             * @param {Number} timeStep Amount of time you wish to proceed. Units are seconds.
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
             * Begin World time progress.
             * Ever other enterframe, stepSimulation will be automaticall called up.
             */
            play: function() {
                var core = enchant.Core.instance;
                if (!this.isPlaying) {
                    this.isPlaying = true;
                    core.addEventListener('enterframe', this._stepping);
                }
            },
            /**
             * Stop World time progress.
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
             * Physical Sprite.
             * If you add to PhySprite3D, physical calculation will be applied when stepSimulation is called up.
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
             * Expand and contract PhySprite3D.
             * The expansion rate displayed on the expansion rate in World will be changed at the same time.
             * @param {Number} x x axis expansion rate.
             * @param {Number} y y axis expansion rate.
             * @param {Number} z z axis expansion rate.
             */
            scale: function(x, y, z) {
                enchant.gl.Sprite3D.prototype.scale.call(this, x, y, z);
                this.rigid.scale(x, y, z);
            },
            /**
             * Move PhySprite3D horizontally.
             * Displayed position and World position will be changed.
             * @param {Number} x Amount of parallel movement on x axis.
             * @param {Number} y Amount of parallel movement on y axis.
             * @param {Number} z Amount of parallel movement on z axis.
             */
            translate: function(x, y, z) {
                enchant.gl.Sprite3D.prototype.translate.call(this, x, y, z);
                this.rigid.translate(x, y, z);
            },
            /**
             * Set rotation line acquired from quaternion in rotation line.
             * Posture in World will also be changed.
             * @param {enchant.gl.Quat} quat
             */
            rotationSet: function(quat) {
                enchant.gl.Sprite3D.prototype.rotationSet.call(this, quat);
                this.rigid.rotationSet(quat);
            },
            /**
             * Rotation line acquired from quaternion is applied in rotation line.
             * Posture in World will also be changed.
             * @param {enchant.gl.Quat} quat
             */
            rotationApply: function(quat) {
                enchant.gl.Sprite3D.prototype.rotationApply.call(this, quat);
                this.rigid.rotationApply(quat);
            },
            /**
             */
            clearForces: function() {
                this.rigid.clearForces();
            },
            /**
             * Collision detection with another PhySprite3D.
             * @param {enchant.gl.physics.PhySprite3D} sprite PhySprite3D to be detected.
             * @return {Boolean} bool Presence or absence of collision.
             */
            contactTest: function(sprite) {
                return this.rigid.contactTest(sprite.rigid);
            },
            /**
             * Add power to rigid body.
             * Power is added to center of rigid body.
             * @param {Number} powerX Power on x axis.
             * @param {Number} powerY Power on y axis.
             * @param {Number} powerZ Power on z axis.
             * @see enchant.gl.physics.Rigid#applyCentralImpulse
             */
            applyCentralImpulse: function(powx, powy, powz) {
                this.rigid.applyCentralImpulse(powx, powy, powz);
            },
            /**
             * Add power to rigid body.
             * Power is added to designated position.
             * @param {Number} powerX x axis power.
             * @param {Number} powerY y axis power.
             * @param {Number} powerZ z axis power.
             * @param {Number} positonX x coordinates to which power is added.
             * @param {Number} positonY y coordinates to which power is added.
             * @param {Number} positonZ z coordinates to which power is added.
             * @see enchant.gl.physics.Rigid#applyImpulse
             */
            applyImpulse: function(powx, powy, powz, posx, posy, posz) {
                this.rigid.applyImpulse(powx, powy, powz, posx, posy, posz);
            },
            /**
             * Kinematize Rigid.
             */
            kinematize: function() {
                this.rigid.kinematize();
            },
            /**
             * PhySprite3D restitutions.
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
             * PhySprite3D frictions.
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
             * Rectangular PhySprite3D.
             * If PhySprite3D is added, physical calculation will be applied each time stepSimulation is called up.
             * @param {Number} scaleX Distance between center of rectangular body and perpendicular x-axis surface.
             * @param {Number} scaleY Distance between center of rectangular body and perpendicular y-axis surface.
             * @param {Number} scaleZ Distance between center of rectangular body and perpendicular z-axis surface.
             * @param {Number} mass Mass of rigid body.
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
             * Cubic type PhySprite3D.
             * If added to PhySprite3D, physical calculation will be applied each time stepSimulation is called up.
             * @param {Number} scale Distance between center of box and surface.
             * @param {Number} mass Mass of rigid body.
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
             * Spherical PhySprite3D.
             * If added to PhySprite3D, physical calculation will be applied each time stepSimulation is called up.
             * @param {Number} radius Spherical body radius.
             * @param {Number} mass Rigid body mass.
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
             * Cylindrical PhySprite3D.
             * If added to PhySprite3D, physical calculation will be applied each time stepSimulation is called up.
             * @param {Number} radius Cylinder radius.
             * @param {Number} height Cylinder height.
             * @param {Number} mass Rigid body mass.
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
             * Capsule type PhySprite3D.
             * A shape with a cylinder running along the y axis and hemispheres at both ends.
             * If added to PhySprite3D, physical calculation will be applied each time stepSimulation is called up.
             * @param {Number} radius Hemispherical radius.
             * @param {Number} height Half the height of cylinder.
             * @param {Number} mass Rigid body mass.
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
             * Infinite plane type PhySprite3D.
             * If added to PhySprite3D, physical calculation will be performed each time stepSimulation is called up.
             * @param {Number} NormalX x component on plane normal vector.
             * @param {Number} NormalY y component on plane normal vector.
             * @param {Number} NormalZ z component on plane normal vector.
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
             * Square type PhySprite3D.
             * If added to PhySprite3D, physical calculation will be performed each time stepSimulation is called up.
             * @param {Number} scale Distance between center and edge of square.
             * @param {Number} mass Rigid body mass.
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
