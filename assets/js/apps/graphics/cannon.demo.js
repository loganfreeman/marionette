/**
 * @class CANNON.Demo
 * @brief Demo framework class. If you want to learn how to connect Cannon.js with Three.js, please look at the examples/ instead.
 * @param Object options
 */
THREE.ColorUtils = {
        
        adjustHSV : function ( color, h, s, v ) {

                var hsv = THREE.ColorUtils.__hsv;
                
                THREE.ColorUtils.rgbToHsv( color, hsv );

                hsv.h = THREE.ColorUtils.clamp( hsv.h + h, 0, 1 );
                hsv.s = THREE.ColorUtils.clamp( hsv.s + s, 0, 1 );
                hsv.v = THREE.ColorUtils.clamp( hsv.v + v, 0, 1 );
                
                color.setHSL( hsv.h, hsv.s, hsv.v );

        },
        
        // based on MochiKit implementation by Bob Ippolito

        rgbToHsv : function ( color, hsv ) {

                var r = color.r;
                var g = color.g;
                var b = color.b;
                
                var max = Math.max( Math.max( r, g ), b );
                var min = Math.min( Math.min( r, g ), b );

                var hue;
                var saturation;
                var value = max;

                if ( min == max )       {

                        hue = 0;
                        saturation = 0;

                } else {

                        var delta = ( max - min );
                        saturation = delta / max;

                        if ( r == max ) {

                                hue = ( g - b ) / delta;

                        } else if ( g == max ) {

                                hue = 2 + ( ( b - r ) / delta );

                        } else  {

                                hue = 4 + ( ( r - g ) / delta );
                        }

                        hue /= 6;

                        if ( hue < 0 ) {

                                hue += 1;

                        }
                        
                        if ( hue > 1 ) {

                                hue -= 1;

                        }

                }
                
                if ( hsv === undefined ) {
                        
                        hsv = { h: 0, s: 0, v: 0 };

                }
                
                hsv.h = hue;
                hsv.s = saturation;
                hsv.v = value;
                
                return hsv;

        },
        
        clamp: function ( x, a, b ) { 
                
                return x < a ? a : ( x > b ? b : x ); 

        }

};

THREE.ColorUtils.__hsv = { h: 0, s: 0, v: 0 };


/**
 * @author Eberhard Graether / http://egraether.com/
 */

THREE.TrackballControls = function ( object, domElement ) {

	var _this = this,
	STATE = { NONE : -1, ROTATE : 0, ZOOM : 1, PAN : 2 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
	this.radius = ( this.screen.width + this.screen.height ) / 4;

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

	this.target = new THREE.Vector3( 0, 0, 0 );

	var _keyPressed = false,
	_state = STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotateStart = new THREE.Vector3(),
	_rotateEnd = new THREE.Vector3(),

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();


	// methods

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.getMouseOnScreen = function( clientX, clientY ) {

		return new THREE.Vector2(
			( clientX - _this.screen.offsetLeft ) / _this.radius * 0.5,
			( clientY - _this.screen.offsetTop ) / _this.radius * 0.5
		);

	};

	this.getMouseProjectionOnBall = function( clientX, clientY ) {

		var mouseOnBall = new THREE.Vector3(
			( clientX - _this.screen.width * 0.5 - _this.screen.offsetLeft ) / _this.radius,
			( _this.screen.height * 0.5 + _this.screen.offsetTop - clientY ) / _this.radius,
			0.0
		);

		var length = mouseOnBall.length();

		if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		_eye.copy( _this.object.position ).subSelf( _this.target );

		var projection = _this.object.up.clone().setLength( mouseOnBall.y );
		projection.addSelf( _this.object.up.clone().crossSelf( _eye ).setLength( mouseOnBall.x ) );
		projection.addSelf( _eye.setLength( mouseOnBall.z ) );

		return projection;

	};

	this.rotateCamera = function() {

		var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

		if ( angle ) {

			var axis = ( new THREE.Vector3() ).cross( _rotateStart, _rotateEnd ).normalize(),
				quaternion = new THREE.Quaternion();

			angle *= _this.rotateSpeed;

			quaternion.setFromAxisAngle( axis, -angle );

			quaternion.multiplyVector3( _eye );
			quaternion.multiplyVector3( _this.object.up );

			quaternion.multiplyVector3( _rotateEnd );

			if ( _this.staticMoving ) {

				_rotateStart = _rotateEnd;

			} else {

				quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
				quaternion.multiplyVector3( _rotateStart );

			}

		}

	};

	this.zoomCamera = function() {

		var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

		if ( factor !== 1.0 && factor > 0.0 ) {

			_eye.multiplyScalar( factor );

			if ( _this.staticMoving ) {

				_zoomStart = _zoomEnd;

			} else {

				_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

			}

		}

	};

	this.panCamera = function() {

		var mouseChange = _panEnd.clone().subSelf( _panStart );

		if ( mouseChange.lengthSq() ) {

			mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

			var pan = _eye.clone().crossSelf( _this.object.up ).setLength( mouseChange.x );
			pan.addSelf( _this.object.up.clone().setLength( mouseChange.y ) );

			_this.object.position.addSelf( pan );
			_this.target.addSelf( pan );

			if ( _this.staticMoving ) {

				_panStart = _panEnd;

			} else {

				_panStart.addSelf( mouseChange.sub( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

			}

		}

	};

	this.checkDistances = function() {

		if ( !_this.noZoom || !_this.noPan ) {

			if ( _this.object.position.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.object.position.setLength( _this.maxDistance );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.object.position.add( _this.target, _eye.setLength( _this.minDistance ) );

			}

		}

	};

	this.update = function() {

		_eye.copy( _this.object.position ).subSelf( this.target );

		if ( !_this.noRotate ) {

			_this.rotateCamera();

		}
		
		if ( !_this.noZoom ) {

			_this.zoomCamera();

		}

		if ( !_this.noPan ) {

			_this.panCamera();

		}

		_this.object.position.add( _this.target, _eye );

		_this.checkDistances();

		_this.object.lookAt( _this.target );

	};


	// listeners

	function keydown( event ) {

		if ( ! _this.enabled ) return;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && !_this.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && !_this.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === _this.keys[ STATE.PAN ] && !_this.noPan ) {

			_state = STATE.PAN;

		}

		if ( _state !== STATE.NONE ) {

			_keyPressed = true;

		}

	};

	function keyup( event ) {

		if ( ! _this.enabled ) return;

		if ( _state !== STATE.NONE ) {

			_state = STATE.NONE;

		}

	};

	function mousedown( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

			if ( _state === STATE.ROTATE && !_this.noRotate ) {

				_rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );

			} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

				_zoomStart = _zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			} else if ( !this.noPan ) {

				_panStart = _panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			}

		}

	};

	function mousemove( event ) {

		if ( ! _this.enabled ) return;

		if ( _keyPressed ) {

			_rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );
			_zoomStart = _zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );
			_panStart = _panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

			_keyPressed = false;

		}

		if ( _state === STATE.NONE ) {

			return;

		} else if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

		}

	};

	function mouseup( event ) {

		if ( ! _this.enabled ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', mousemove, false );
	this.domElement.addEventListener( 'mousedown', mousedown, false );
	this.domElement.addEventListener( 'mouseup', mouseup, false );

	window.addEventListener( 'keydown', keydown, false );
	window.addEventListener( 'keyup', keyup, false );

};



CANNON.Demo = function(options){

    // API
    this.removeVisual = removeVisual;
    this.addScene = addScene;
    this.restartCurrentScene = restartCurrentScene;
    this.changeScene = changeScene;
    this.addVisual = addVisual;
    this.removeVisual = removeVisual;
    this.getWorld = getWorld;
    this.start = start;

    // Global settings
    var settings = {
        stepFrequency:60,
        quatNormalizeSkip:2,
        quatNormalizeFast:true,
        gx:0.0,
        gy:0.0,
        gz:0.0,
        iterations:3,
        tolerance:0.0001,
        k:1000,
        d:3,
        scene:0,
        paused:false,
        rendermode:"solid",
        constraints:false,
        contacts:false,  // Contact points
        cm2contact:false, // center of mass to contact points
        normals:false, // contact normals
        axes:false, // "local" frame axes
        particleSize:0.1,
        shadows:true,
        aabbs:false,
        profiling:false,
    };

    // Extend settings with options
    options = options || {};
    for(var key in options){
        if(key in settings){
            settings[key] = options[key];
        }
    }
    
    var parentContainer = typeof options.container === 'undefined' ? document.body : document.getElementById(options.container);

    if(settings.stepFrequency % 60 !== 0){
        throw new Error("stepFrequency must be a multiple of 60.");
    }

    var bodies = [];
    var visuals = [];
    var scenes = [];
    var gui = null;
    var smoothie = null;
    var smoothieCanvas = null;
    var scenePicker = {};

    var three_contactpoint_geo = new THREE.SphereGeometry( 0.1, 6, 6);
    var particleGeo = new THREE.SphereGeometry( 1, 16, 8 );

    // Material
    var materialColor = 0xdddddd;
    var solidMaterial = new THREE.MeshLambertMaterial( { color: materialColor } );
    THREE.ColorUtils.adjustHSV( solidMaterial.color, 0, 0, 0.9 );
    var wireframeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe:true } );
    var currentMaterial = solidMaterial;
    var contactDotMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    var particleMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );

    // Geometry caches
    var contactMeshCache = new GeometryCache(function(){
        return new THREE.Mesh( three_contactpoint_geo, contactDotMaterial );
    });
    var cm2contactMeshCache = new GeometryCache(function(){
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(1,1,1));
        return new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
    });
    var bboxGeometry = new THREE.CubeGeometry(1,1,1);
    var bboxMaterial = new THREE.MeshBasicMaterial({
        color: materialColor,
        wireframe:true
    });
    var bboxMeshCache = new GeometryCache(function(){
        return new THREE.Mesh(bboxGeometry,bboxMaterial);
    });
    var distanceConstraintMeshCache = new GeometryCache(function(){
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(1,1,1));
        return new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
    });
    var p2pConstraintMeshCache = new GeometryCache(function(){
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(1,1,1));
        return new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
    });
    var normalMeshCache = new GeometryCache(function(){
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0,0,0));
        geometry.vertices.push(new THREE.Vector3(1,1,1));
        return new THREE.Line( geometry, new THREE.LineBasicMaterial({color:0x00ff00}));
    });
    var axesMeshCache = new GeometryCache(function(){
        var mesh = new THREE.Object3D();
        mesh.useQuaternion = true;
        var origin = new THREE.Vector3(0,0,0);
        var gX = new THREE.Geometry();
        var gY = new THREE.Geometry();
        var gZ = new THREE.Geometry();
        gX.vertices.push(origin);
        gY.vertices.push(origin);
        gZ.vertices.push(origin);
        gX.vertices.push(new THREE.Vector3(1,0,0));
        gY.vertices.push(new THREE.Vector3(0,1,0));
        gZ.vertices.push(new THREE.Vector3(0,0,1));
        var lineX = new THREE.Line( gX, new THREE.LineBasicMaterial({color:0xff0000}));
        var lineY = new THREE.Line( gY, new THREE.LineBasicMaterial({color:0x00ff00}));
        var lineZ = new THREE.Line( gZ, new THREE.LineBasicMaterial({color:0x0000ff}));
        mesh.add(lineX);
        mesh.add(lineY);
        mesh.add(lineZ);
        return mesh;
    });
    function restartGeometryCaches(){
        contactMeshCache.restart();
        contactMeshCache.hideCached();

        cm2contactMeshCache.restart();
        cm2contactMeshCache.hideCached();

        distanceConstraintMeshCache.restart();
        distanceConstraintMeshCache.hideCached();

        normalMeshCache.restart();
        normalMeshCache.hideCached();
    }

    // Create physics world
    var world = new CANNON.World();
    world.broadphase = new CANNON.NaiveBroadphase();

    var renderModes = ["solid","wireframe"];

    function updategui(){
        if(gui){
            // First level
            for (var i in gui.__controllers){
                gui.__controllers[i].updateDisplay();
            }

            // Second level
            for (var f in gui.__folders){
                for (var i in gui.__folders[f].__controllers){
                    gui.__folders[f].__controllers[i].updateDisplay();
                }
            }
        }
    }

    var light, scene, ambient, stats, info;

    function setRenderMode(mode){
        if(renderModes.indexOf(mode) === -1){
            throw new Error("Render mode "+mode+" not found!");
        }

        switch(mode){
        case "solid":
            currentMaterial = solidMaterial;
            light.intensity = 1;
            ambient.color.setHex(0x222222);
            break;
        case "wireframe":
            currentMaterial = wireframeMaterial;
            light.intensity = 0;
            ambient.color.setHex(0xffffff);
            break;
        }

        function setMaterial(node,mat){
            if(node.material){
                node.material = mat;
            }
            for(var i=0; i<node.children.length; i++){
                setMaterial(node.children[i],mat);
            }
        }
        for(var i=0; i<visuals.length; i++){
            setMaterial(visuals[i],currentMaterial);
        }
        settings.rendermode = mode;
    }

    /**
    * @method addScene
    * @memberof CANNON.Demo
    * @brief Add a scene to the demo app
    * @param title Title of the scene
    * @param function A function that takes one argument, app, and initializes a physics scene. The function runs app.setWorld(body), app.addVisual(body), app.removeVisual(body) etc.
    */
    function addScene(title,initfunc){
        if(typeof(title) !== "string"){
            throw new Error("1st argument of Demo.addScene(title,initfunc) must be a string!");
        }
        if(typeof(initfunc)!=="function"){
            throw new Error("2nd argument of Demo.addScene(title,initfunc) must be a function!");
        }
        scenes.push(initfunc);
        var idx = scenes.length-1;
        scenePicker[title] = function(){
            changeScene(idx);
        };
        sceneFolder.add(scenePicker,title);
    }

    /**
    * @method restartCurrentScene
    * @memberof CANNON.Demo
    * @brief Restarts the current scene
    */
    function restartCurrentScene(){
        var N = bodies.length;
        for(var i=0; i<N; i++){
            var b = bodies[i];
            b.initPosition.copy(b.position);
            b.initVelocity.copy(b.velocity);
            if(b.initAngularVelocity){
                b.initAngularVelocity.copy(b.angularVelocity);
                b.initQuaternion.copy(b.quaternion);
            }
        }
    }

    function makeSureNotZero(vec){
        if(vec.x===0.0){
            vec.x = 1e-6;
        }
        if(vec.y===0.0){
            vec.y = 1e-6;
        }
        if(vec.z===0.0){
            vec.z = 1e-6;
        }
    }

    function updateVisuals(){
        var N = bodies.length;

        // Read position data into visuals
        for(var i=0; i<N; i++){
            var b = bodies[i], visual = visuals[i];
            b.position.copy(visual.position);
            if(b.quaternion)
                b.quaternion.copy(visual.quaternion);
        }

        // Render contacts
        contactMeshCache.restart();
        if(settings.contacts){
            // if ci is even - use body i, else j
            for(var ci=0; ci < world.contacts.length; ci++){
                for(var ij=0; ij < 2; ij++){
                    var  mesh = contactMeshCache.request(),
                    c = world.contacts[ci],
                    b = ij===0 ? c.bi : c.bj,
                    r = ij===0 ? c.ri : c.rj;
                    mesh.position.set( b.position.x + r.x , b.position.y + r.y , b.position.z + r.z );
                }
            }
        }
        contactMeshCache.hideCached();

        // Lines from center of mass to contact point
        cm2contactMeshCache.restart();
        if(settings.cm2contact){
            for(var ci=0; ci<world.contacts.length; ci++){
                for(var ij=0; ij < 2; ij++){
                    var  line = cm2contactMeshCache.request(),
                    c = world.contacts[ci],
                    b = ij===0 ? c.bi : c.bj,
                    r = ij===0 ? c.ri : c.rj;
                    line.scale.set( r.x, r.y, r.z);
                    makeSureNotZero(line.scale);
                    b.position.copy(line.position);
                }
            }
        }
        cm2contactMeshCache.hideCached();

        distanceConstraintMeshCache.restart();
        p2pConstraintMeshCache.restart();
        if(settings.constraints){
            // Lines for distance constraints
            for(var ci=0; ci<world.constraints.length; ci++){
                var c = world.constraints[ci];
                if(!(c instanceof CANNON.DistanceConstraint)){
                    continue;
                }

                var nc = c.equations.normal;

                var bi=nc.bi, bj=nc.bj, line = distanceConstraintMeshCache.request();
                var i=bi.id, j=bj.id;

                // Remember, bj is either a Vec3 or a Body.
                var v;
                if(bj.position){
                    v = bj.position;
                } else {
                    v = bj;
                }
                line.scale.set( v.x-bi.position.x,
                                v.y-bi.position.y,
                                v.z-bi.position.z );
                makeSureNotZero(line.scale);
                bi.position.copy(line.position);
            }


            // Lines for distance constraints
            for(var ci=0; ci<world.constraints.length; ci++){
                var c = world.constraints[ci];
                if(!(c instanceof CANNON.PointToPointConstraint)){
                    continue;
                }
                var n = c.equations.normal;
                var bi=n.bi, bj=n.bj, relLine1 = p2pConstraintMeshCache.request(), relLine2 = p2pConstraintMeshCache.request(), diffLine = p2pConstraintMeshCache.request();
                var i=bi.id, j=bj.id;

                relLine1.scale.set( n.ri.x, n.ri.y, n.ri.z );
                relLine2.scale.set( n.rj.x, n.rj.y, n.rj.z );
                diffLine.scale.set( -n.penetrationVec.x, -n.penetrationVec.y, -n.penetrationVec.z );
                makeSureNotZero(relLine1.scale);
                makeSureNotZero(relLine2.scale);
                makeSureNotZero(diffLine.scale);
                bi.position.copy(relLine1.position);
                bj.position.copy(relLine2.position);
                n.bj.position.vadd(n.rj,diffLine.position);
            }
        }
        p2pConstraintMeshCache.hideCached();
        distanceConstraintMeshCache.hideCached();

        // Normal lines
        normalMeshCache.restart();
        if(settings.normals){
            for(var ci=0; ci<world.contacts.length; ci++){
                var c = world.contacts[ci];
                var bi=c.bi, bj=c.bj, line=normalMeshCache.request();
                var i=bi.id, j=bj.id;
                var n = c.ni;
                var b = bi;
                line.scale.set(n.x,n.y,n.z);
                makeSureNotZero(line.scale);
                b.position.copy(line.position);
                c.ri.vadd(line.position,line.position);
            }
        }
        normalMeshCache.hideCached();

        // Frame axes for each body
        axesMeshCache.restart();
        if(settings.axes){
            for(var bi=0; bi<bodies.length; bi++){
                var b = bodies[bi], mesh=axesMeshCache.request();
                b.position.copy(mesh.position);
                if(b.quaternion)
                    b.quaternion.copy(mesh.quaternion);
            }
        }
        axesMeshCache.hideCached();

        // AABBs
        bboxMeshCache.restart();
        if(settings.aabbs){
            for(var i=0; i<bodies.length; i++){
                var b = bodies[i];
                if(b.computeAABB){
                    
                    if(b.aabbNeedsUpdate){
                        b.computeAABB();
                    }

                    // Todo: cap the infinite AABB to scene AABB, for now just dont render
                    if( isFinite(b.aabbmax.x) &&
                        isFinite(b.aabbmax.y) &&
                        isFinite(b.aabbmax.z) &&
                        isFinite(b.aabbmin.x) &&
                        isFinite(b.aabbmin.y) &&
                        isFinite(b.aabbmin.z) && 
                        b.aabbmax.x - b.aabbmin.x != 0 && 
                        b.aabbmax.y - b.aabbmin.y != 0 && 
                        b.aabbmax.z - b.aabbmin.z != 0){
                            var mesh = bboxMeshCache.request();
                            mesh.scale.set( b.aabbmax.x - b.aabbmin.x,
                                            b.aabbmax.y - b.aabbmin.y,
                                            b.aabbmax.z - b.aabbmin.z);
                            mesh.position.set(  (b.aabbmax.x + b.aabbmin.x)*0.5,
                                                (b.aabbmax.y + b.aabbmin.y)*0.5,
                                                (b.aabbmax.z + b.aabbmin.z)*0.5);
                        }
                }
            }
        }
        bboxMeshCache.hideCached();
    }

    if ( ! Detector.webgl )
        Detector.addGetWebGLMessage();

    var SHADOW_MAP_WIDTH = 512;
    var SHADOW_MAP_HEIGHT = 512;
    var MARGIN = 0;
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;
    var camera, controls, renderer;
    var container;
    var NEAR = 5, FAR = 2000;
    var sceneHUD, cameraOrtho, hudMaterial;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {

        container = document.createElement( 'div' );
        parentContainer.appendChild( container );

        // Camera
        camera = new THREE.PerspectiveCamera( 24, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );

        camera.up.set(0,0,1);
        camera.position.set(0,30,20);

        // SCENE
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x222222, 1000, FAR );

        // LIGHTS
        ambient = new THREE.AmbientLight( 0x222222 );
        scene.add( ambient );

        light = new THREE.SpotLight( 0xffffff );
        light.position.set( 30, 30, 40 );
        light.target.position.set( 0, 0, 0 );

        light.castShadow = true;

        light.shadowCameraNear = 10;
        light.shadowCameraFar = 100;//camera.far;
        light.shadowCameraFov = 30;

        light.shadowMapBias = 0.0039;
        light.shadowMapDarkness = 0.5;
        light.shadowMapWidth = SHADOW_MAP_WIDTH;
        light.shadowMapHeight = SHADOW_MAP_HEIGHT;

        //light.shadowCameraVisible = true;

        scene.add( light );
        scene.add( camera );

        // RENDERER
        renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1, antialias: false } );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.domElement.style.position = "relative";
        renderer.domElement.style.top = MARGIN + 'px';
        container.appendChild( renderer.domElement );

        // Add info
        info = document.createElement( 'div' );
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        info.innerHTML = '<a href="http://github.com/schteppe/cannon.js">cannon.js</a> - javascript 3d physics';
        container.appendChild( info );

        document.addEventListener('mousemove',onDocumentMouseMove);
        window.addEventListener('resize',onWindowResize);

        renderer.setClearColor( scene.fog.color, 1 );
        renderer.autoClear = false;

        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        // STATS
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild( stats.domElement );

        // Smoothie (test)
        smoothieCanvas = document.createElement("canvas");
        smoothieCanvas.style.position = 'absolute';
        smoothieCanvas.style.top = '0px';
        smoothieCanvas.style.zIndex = 100;
        container.appendChild( smoothieCanvas );
        smoothie = new SmoothieChart({
            maxDataSetLength:100,
            millisPerPixel:10,
            grid: {
                strokeStyle:'rgb(125, 125, 125)',
                fillStyle:'rgb(0, 0, 0)',
                lineWidth: 1,
                millisPerLine: 250,
                verticalSections: 6
            },
            labels: {
                fillStyle:'rgb(180, 180, 180)'
            }
        });
        smoothie.streamTo(smoothieCanvas);
        // Create time series for each profile label
        var lines = {};
        var colors = [[255, 0, 0],[0, 255, 0],[0, 0, 255],[255,255,0],[255,0,255],[0,255,255]];
        var i=0;
        for(var label in world.profile){
            var c = colors[i%colors.length];
            lines[label] = new TimeSeries({
                label : label,
                fillStyle : "rgb("+c[0]+","+c[1]+","+c[2]+")",
                maxDataLength : 500,
            });
            i++;
        }

        // Add a random value to each line every second
        world.addEventListener("postStep",function(evt) {
            for(var label in world.profile)
                lines[label].append(world.time * 1000, world.profile[label]);
        });

        // Add to SmoothieChart
        var i=0;
        for(var label in world.profile){
            var c = colors[i%colors.length];
            smoothie.addTimeSeries(lines[label],{
                strokeStyle : "rgb("+c[0]+","+c[1]+","+c[2]+")",
                fillStyle:"rgba("+c[0]+","+c[1]+","+c[2]+",0.3)",
                lineWidth:1
            });
            i++;
        }
        world.doProfiling = false;
        smoothie.stop();
        smoothieCanvas.style.display = "none";


        // Trackball controls
        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.2;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = false;
        controls.dynamicDampingFactor = 0.3;
        var radius = 100;
        controls.minDistance = 0.0;
        controls.maxDistance = radius * 1000;
        //controls.keys = [ 65, 83, 68 ]; // [ rotateKey, zoomKey, panKey ]
        controls.screen.width = SCREEN_WIDTH;
        controls.screen.height = SCREEN_HEIGHT;
    }

    var t = 0, newTime, delta;

    function animate(){
        requestAnimationFrame( animate );
        if(!settings.paused){
            updateVisuals();
            updatePhysics();
        }
        render();
        stats.update();
    }

    function updatePhysics(){
        // Step world
        for(var i=0; i<Math.ceil(settings.stepFrequency/60); i++){
            world.step(1/settings.stepFrequency);
        }
    }

    function onDocumentMouseMove( event ) {
        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY );
    }

    function onWindowResize( event ) {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        controls.screen.width = SCREEN_WIDTH;
        controls.screen.height = SCREEN_HEIGHT;

        camera.radius = ( SCREEN_WIDTH + SCREEN_HEIGHT ) / 4;
    }

    function render(){
        controls.update();
        renderer.clear();
        renderer.render( scene, camera );
    }

    document.addEventListener('keypress',function(e){

        if(e.keyCode){
            switch(e.keyCode){
            case 32: // Space - restart
                restartCurrentScene();
                break;

            case 104: // h - toggle widgets
                if(stats.domElement.style.display=="none"){
                    stats.domElement.style.display = "block";
                    info.style.display = "block";
                } else {
                    stats.domElement.style.display = "none";
                    info.style.display = "none";
                }
                break;

            case 97: // a - AABBs
                settings.aabbs = !settings.aabbs;
                updategui();
                break;

            case 99: // c - constraints
                settings.constraints = !settings.constraints;
                updategui();
                break;

            case 112: // p
                settings.paused = !settings.paused;
                updategui();
                break;

            case 115: // s
                updatePhysics();
                updateVisuals();
                break;

            case 109: // m - toggle materials
                var idx = renderModes.indexOf(settings.rendermode);
                idx++;
                idx = idx % renderModes.length; // begin at 0 if we exceeded number of modes
                setRenderMode(renderModes[idx]);
                updategui();
                break;

            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                // Change scene
                // Only for numbers 1-9 and if no input field is active
                if(scenes.length > e.keyCode-49 && !document.activeElement.localName.match(/input/)){
                    changeScene(e.keyCode-49);
                }
                break;
            }
        }
    });

    if(window.dat!=undefined){
        gui = new dat.GUI();

        // Render mode
        var rf = gui.addFolder('Rendering');
        rf.add(settings,'rendermode',{Solid:"solid",Wireframe:"wireframe"}).onChange(function(mode){
            setRenderMode(mode);
        });
        rf.add(settings,'contacts');
        rf.add(settings,'cm2contact');
        rf.add(settings,'normals');
        rf.add(settings,'constraints');
        rf.add(settings,'axes');
        rf.add(settings,'particleSize').min(0).max(1).onChange(function(size){
            for(var i=0; i<visuals.length; i++){
                if(bodies[i] instanceof CANNON.Particle)
                    visuals[i].scale.set(size,size,size);
            }
        });
        rf.add(settings,'shadows').onChange(function(shadows){
            if(shadows){
                renderer.shadowMapAutoUpdate = true;
            } else {
                renderer.shadowMapAutoUpdate = false;
                renderer.clearTarget( light.shadowMap );
            }
        });
        rf.add(settings,'aabbs');
        rf.add(settings,'profiling').onChange(function(profiling){
            if(profiling){
                world.doProfiling = true;
                smoothie.start();
                smoothieCanvas.style.display = "block";
            } else {
                world.doProfiling = false;
                smoothie.stop();
                smoothieCanvas.style.display = "none";
            }

        });

        // World folder
        var wf = gui.addFolder('World');
        // Pause
        wf.add(settings, 'paused').onChange(function(p){
            /*if(p){
                smoothie.stop();
            } else {
                smoothie.start();
            }*/
        });
        wf.add(settings, 'stepFrequency',60,60*10).step(60);
        var maxg = 100;
        wf.add(settings, 'gx',-maxg,maxg).onChange(function(gx){
            if(!isNaN(gx))
                world.gravity.set(gx,settings.gy,settings.gz);
        });
        wf.add(settings, 'gy',-maxg,maxg).onChange(function(gy){
            if(!isNaN(gy))
                world.gravity.set(settings.gx,gy,settings.gz);
        });
        wf.add(settings, 'gz',-maxg,maxg).onChange(function(gz){
            if(!isNaN(gz))
                world.gravity.set(settings.gx,settings.gy,gz);
        });
        wf.add(settings, 'quatNormalizeSkip',0,50).step(1).onChange(function(skip){
            if(!isNaN(skip)){
                world.quatNormalizeSkip = skip;
            }
        });
        wf.add(settings, 'quatNormalizeFast').onChange(function(fast){
            world.quatNormalizeFast = !!fast;
        });

        // Solver folder
        var sf = gui.addFolder('Solver');
        sf.add(settings, 'iterations',1,50).step(1).onChange(function(it){
            world.solver.iterations = it;
        });
        sf.add(settings, 'k',10,10000).onChange(function(k){
            world.solver.setSpookParams(k,world.solver.d);
        });
        sf.add(settings, 'd',0,20).step(0.1).onChange(function(d){
            world.solver.setSpookParams(world.solver.k,d);
        });
        sf.add(settings, 'tolerance',0.0,10.0).step(0.01).onChange(function(t){
            world.solver.tolerance = t;
        });

        // Scene picker
        var sceneFolder = gui.addFolder('Scenes');
        sceneFolder.open();
    }

    function changeScene(n){
        settings.paused = false;
        updategui();
        buildScene(n);
    }

    function shape2mesh(shape){
        var wireframe = settings.renderMode=="wireframe";
        var mesh;
        switch(shape.type){

        case CANNON.Shape.types.SPHERE:
            var sphere_geometry = new THREE.SphereGeometry( shape.radius, 8, 8);
            mesh = new THREE.Mesh( sphere_geometry, currentMaterial );
            break;

        case CANNON.Shape.types.PLANE:
            var geometry = new THREE.PlaneGeometry( 10, 10 , 4 , 4 );
            mesh = new THREE.Object3D();
            var submesh = new THREE.Object3D();
            var ground = new THREE.Mesh( geometry, currentMaterial );
            ground.scale = new THREE.Vector3(100,100,100);
            submesh.add(ground);

            ground.castShadow = true;
            ground.receiveShadow = true;

            mesh.add(submesh);
            break;

        case CANNON.Shape.types.BOX:
            var box_geometry = new THREE.CubeGeometry(  shape.halfExtents.x*2,
                                                        shape.halfExtents.y*2,
                                                        shape.halfExtents.z*2 );
            mesh = new THREE.Mesh( box_geometry, currentMaterial );
            break;

        case CANNON.Shape.types.CONVEXPOLYHEDRON:
            var verts = [];
            for(var i=0; i<shape.vertices.length; i++){
                verts.push(new THREE.Vector3(shape.vertices[i].x,
                shape.vertices[i].y,
                shape.vertices[i].z));
            }
            var geo = new THREE.ConvexGeometry( verts );
            mesh = new THREE.Mesh( geo, currentMaterial );

            break;

        case CANNON.Shape.types.COMPOUND:
            // recursive compounds
            var o3d = new THREE.Object3D();
            for(var i = 0; i<shape.childShapes.length; i++){

                // Get child information
                var subshape = shape.childShapes[i];
                var o = shape.childOffsets[i];
                var q = shape.childOrientations[i];
        
                var submesh = shape2mesh(subshape);
                submesh.position.set(o.x,o.y,o.z);
                submesh.quaternion.set(q.x,q.y,q.z,q.w);
        
                submesh.useQuaternion = true;
                o3d.add(submesh);
                mesh = o3d;
            }
            break;

        default:
            throw "Visual type not recognized: "+shape.type;
        }

        mesh.receiveShadow = true;
        mesh.castShadow = true;
        if(mesh.children){
            for(var i=0; i<mesh.children.length; i++){
                mesh.children[i].castShadow = true;
                mesh.children[i].receiveShadow = true;
                if(mesh.children[i]){
                    for(var j=0; j<mesh.children[i].length; j++){
                        mesh.children[i].children[j].castShadow = true;
                        mesh.children[i].children[j].receiveShadow = true;
                    }
                }
            }
        }
        return mesh;
    }

    function start(){
        buildScene(0);
    }

    function buildScene(n){
        // Remove current bodies and visuals
        var num = visuals.length;
        for(var i=0; i<num; i++){
            world.remove(bodies.pop());
            var mesh = visuals.pop();
            scene.remove(mesh);
        }
        // Remove all constraints
        while(world.constraints.length)
            world.removeConstraint(world.constraints[0]);
    
        // Run the user defined "build scene" function
        scenes[n]();

        // Read the newly set data to the gui
        settings.iterations = world.solver.iterations;
        settings.gx = world.gravity.x+0.0;
        settings.gy = world.gravity.y+0.0;
        settings.gz = world.gravity.z+0.0;
        settings.k = world.solver.k;
        settings.d = world.solver.d;
        settings.quatNormalizeSkip = world.quatNormalizeSkip;
        settings.quatNormalizeFast = world.quatNormalizeFast;
        updategui();

        restartGeometryCaches();
    };


    function addVisual(body){
        // What geometry should be used?
        var mesh;
        if(body instanceof CANNON.RigidBody)
            mesh = shape2mesh(body.shape);
        else if(body instanceof CANNON.Particle){
            mesh = new THREE.Mesh( particleGeo, particleMaterial );
            mesh.scale.set(settings.particleSize,settings.particleSize,settings.particleSize);
        }
        if(mesh) {
            // Add body
            bodies.push(body);
            visuals.push(mesh);
            body.visualref = mesh;
            body.visualref.visualId = bodies.length - 1;
            mesh.useQuaternion = true;
            scene.add(mesh);
        }
    };

    function removeVisual(body){
        if(body.visualref){
            var old_b = [];
            var old_v = [];
            var n = bodies.length;
            for(var i=0; i<n; i++){
                old_b.unshift(bodies.pop());
                old_v.unshift(visuals.pop());
            }
            var id = body.visualref.visualId;
            for(var j=0; j<old_b.length; j++){
                if(j !== id){
                    var i = j>id ? j-1 : j;
                    bodies[i] = old_b[j];
                    visuals[i] = old_v[j];
                    bodies[i].visualref = old_b[j].visualref;
                    bodies[i].visualref.visualId = i;
                }
            }
            body.visualref.visualId = null;
            scene.remove(body.visualref);
            body.visualref = null;
        }
    };

    function getWorld(){
        return world;
    };

    function GeometryCache(createFunc){
        var that=this, geometries=[], gone=[];
        this.request = function(){
            if(geometries.length){
                geo = geometries.pop();
            } else{
                geo = createFunc();
            }
            scene.add(geo);
            gone.push(geo);
            return geo;
        };

        this.restart = function(){
            while(gone.length)
                geometries.push(gone.pop());
        };

        this.hideCached = function(){
            for(var i=0; i<geometries.length; i++)
                scene.remove(geometries[i]);
        }
    }
}