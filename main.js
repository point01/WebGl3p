require([], function(){
	
	/********************************************************************
	WebGL Setup	
	********************************************************************/
	// detect WebGL
	if( !Detector.webgl ){
		Detector.addGetWebGLMessage();
		throw 'WebGL Not Available'
	} 
	// setup webgl renderer full page
	var renderer	= new THREE.WebGLRenderer();
    var CANVAS_WIDTH = 1000, CANVAS_HEIGHT = 600;

	var clock = new THREE.Clock(true);	
	clock.start();
	var ctime = new THREE.Vector2(0, 0);

	renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
    var gbox = document.getElementById('graphicsbox');
    var pauseAnim = false;
    //document.body.appendChild(gbox);
	gbox.appendChild( renderer.domElement );

	// setup a scene and camera
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(60, CANVAS_WIDTH / CANVAS_HEIGHT, 0.01, 1000);
	//camera.up.set (0, 0, 1); /* use the Z axis as the upright direction */
	//camera.position.x = 3;
    camera.position.y = 95;
	camera.position.z = 100;

	//scene.add (new THREE.GridHelper(10, 1));
	//declare the rendering loop
	var onRenderFcts= [];

	// handle window resize events
	var winResize	= new THREEx.WindowResize(renderer, camera)

	renderer.setClearColor( 0x58D3F7, 1);
	/********************************************************************
	Lighting Setup	
	********************************************************************/
	var ambientLight= new THREE.AmbientLight( 0x202020 )
	scene.add( ambientLight)
	var frontLight	= new THREE.DirectionalLight(0xffffff, 1);
	frontLight.position.set(10, 35, 0.0)
	scene.add( frontLight )
    //scene.add ( new THREE.DirectionalLightHelper (frontLight, 1));
	var backLight	= new THREE.SpotLight('white', 1, 0, Math.PI / 6);
    backLight.castShadow = true;
	backLight.position.set(-4, 20, 10)
	scene.add( backLight )
    //scene.add ( new THREE.SpotLightHelper (backLight, 0.2));

    // TEXTURE setup
    var path = "textures/MAK/"
    /* The image names can be ANYTHING, but the the order of the SIX images
       in the array will be used as follows:
       the 1st image => Positive X axis
       the 2nd image => Negative X axis
       the 3rh image => Positive Y axis
       the 4th image => Negative Y axis
       the 5th image => Positive Z axis
       the 6th image => Negative Z axis
     */

    var images = [path + "posx.png", path + "negx.png",
        path + "posy.png", path + "negy.png",
        path + "posz.png", path + "negz.png"];

    var cubemap = THREE.ImageUtils.loadTextureCube( images );

    
	/********************************************************************
	Objects & Coordinate frames setup	
	********************************************************************/
	var frame_cf = new THREE.Matrix4();
	frame_cf.makeTranslation(0, 10, 0);

	var camera_cf = new THREE.Matrix4();
	camera_cf.makeTranslation(25, 25, 25);
	//camera.lookAt( scene.position )
	
	var sphereGeo = new THREE.SphereGeometry(2, 30, 20);
   	var sphereMat = new THREE.MeshBasicMaterial ({envMap:cubemap});
   	var sphere = new THREE.Mesh (sphereGeo, sphereMat);
	sphere.position.x = 0;
   	sphere.position.y = 5;
   	sphere.position.z = 0;

	
	var lavaProp = {
        uniforms : {
			time : {
				type: "v2",
				value : ctime
			},
			color_dark : {
                type: "v4",
                value : new THREE.Vector4(0.3, 0.2, 0.6, 1.0)
            },
            marb_tex : {
                type: "t",
                value : THREE.ImageUtils.loadTexture("texture/marble.jpg")
            }
        },
        vertexShader: document.getElementById("vs0").textContent,
        fragmentShader : document.getElementById("fs0").textContent
    };
    var lavaMat = new THREE.ShaderMaterial(lavaProp);
    
	var goalProp = {
        uniforms : {
			time : {
				type: "v2",
				value : ctime
			},
			color_dark : {
                type: "v4",
                value : new THREE.Vector4(0.3, 0.2, 0.6, 1.0)
            },
            marb_tex : {
                type: "t",
                value : THREE.ImageUtils.loadTexture("texture/marble.jpg")
            }
        },
        vertexShader: document.getElementById("vs1").textContent,
        fragmentShader : document.getElementById("fs1").textContent
    };
	var goalMat = new THREE.ShaderMaterial(goalProp);

    var x = Math.floor((Math.random() * 100) + 1);
    var z = Math.floor((Math.random() * 100) + 1);
    if(x > 50)
    	x = (-x) + 50;
    if(z > 50)
    	z = (-z) + 50;


	var cubeGeometry = new THREE.CubeGeometry(10,10,10,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000} );
	block = new THREE.Mesh( cubeGeometry, goalMat );
	block.position.set(x, -4.9, z);
	
	var lavaGeometry = new THREE.CubeGeometry(20,20,20,1,1,1);
	lavablock1 = new THREE.Mesh( lavaGeometry, lavaMat );
	lavablock1.position.set(30, -9.6, -50);
	
	lavablock2 = new THREE.Mesh( lavaGeometry, lavaMat );
	lavablock2.position.set(-30, -9.6, 50);
		
	lavablock3 = new THREE.Mesh( lavaGeometry, lavaMat );
	lavablock3.position.set(-50, -9.6, -30);
	
	lavablock4 = new THREE.Mesh( lavaGeometry, lavaMat );
	lavablock4.position.set(50, -9.6, 30);
		
   	sphereGeo = new THREE.SphereGeometry(1.5, 30, 20);
   	var spherebottom = new THREE.Mesh (sphereGeo, sphereMat);
   	spherebottom.position.x = 0;
   	spherebottom.position.y = -4;
   	spherebottom.position.z = 0;
   	
   	sphereGeo = new THREE.SphereGeometry(1, 30, 20);
   	var rshouldersph = new THREE.Mesh (sphereGeo, sphereMat);
   	var lshouldersph = new THREE.Mesh (sphereGeo, sphereMat);
   	var relbowsph = new THREE.Mesh (sphereGeo, sphereMat);
   	var lelbowsph = new THREE.Mesh (sphereGeo, sphereMat);
	


	var rfarm_cf = new THREE.Matrix4();
	var lfarm_cf = new THREE.Matrix4();
    rfarm_cf.makeTranslation(0, -6, 0); 
	rfarm_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(-40)));
    lfarm_cf.makeTranslation(0, -6, 0); 
	lfarm_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(-40)));
	
	var rarm_cf = new THREE.Matrix4();
	var larm_cf = new THREE.Matrix4();
	rarm_cf.makeRotationZ(THREE.Math.degToRad(-90));
    rarm_cf.makeTranslation(0, 3, -4); 
	larm_cf.makeRotationZ(THREE.Math.degToRad(-90));
    larm_cf.makeTranslation(0, 3, 4); 

    var rarm = new SwingArm(6);
    var larm = new SwingArm(6);
   	var rfarm = new SwingArm(6);
   	var lfarm = new SwingArm(6);

   	var frame = new SwingFrame();
	
	scene.add(lavablock3);
	scene.add(lavablock4);
	scene.add(lavablock2);
	scene.add(lavablock1);
	scene.add(block);
	scene.add (frame);
    rarm.add (rfarm);
	rarm.add (rshouldersph);
	larm.add (lfarm);
	larm.add(lshouldersph);
	rfarm.add(relbowsph);
	lfarm.add(lelbowsph);
    frame.add (rarm);
	frame.add (larm);
	frame.add(sphere);
	frame.add(spherebottom);
    scene.add (new THREE.AxisHelper(4));

    /* Load the first texture image */
    var stone_tex = THREE.ImageUtils.loadTexture("textures/con.jpg");
    /* for repeat to work, the image size must be 2^k */

    /* repeat the texture 4 times in both direction */
    stone_tex.repeat.set(14,14);
    stone_tex.wrapS = THREE.RepeatWrapping;
    stone_tex.wrapT = THREE.RepeatWrapping;

    /* Load the second texture image */
    var wood_tex = THREE.ImageUtils.loadTexture("textures/wood256.jpg");

    /* mirror repeat the texture 2 times, without
     * mirror repeat the seam between the left
     * and right edge of the texture will be
     * visible */
    wood_tex.repeat.set(2,2);
    wood_tex.wrapS = THREE.MirroredRepeatWrapping;
    wood_tex.wrapT = THREE.MirroredRepeatWrapping;
    var groundPlane = new THREE.PlaneBufferGeometry(120, 120, 10, 10);
    /* attach the texture as the "map" property of the material */
    var groundMat = new THREE.MeshPhongMaterial({color:0xffffff, ambient:0x1d6438, map:stone_tex});
    var ground = new THREE.Mesh (groundPlane, groundMat);
    ground.rotateX(THREE.Math.degToRad(-90));
    scene.add (ground);
	
	var collcount = 0;
	var switcho = false;
	var hit = false;
	
	/********************************************************************
	Animation Controller
	********************************************************************/
	onRenderFcts.push(function(delta, now){
        if (pauseAnim) return;
        var tran = new THREE.Vector3();
        var quat = new THREE.Quaternion();
        var rot = new THREE.Quaternion();
        var vscale = new THREE.Vector3();

    	frame_cf.decompose(tran, quat, vscale);
		frame.position.copy(tran);
		frame.quaternion.copy(quat);
	
        camera_cf.decompose(tran, quat, vscale);
		camera.position.copy(tran);
		camera.quaternion.copy(quat);
		
		/* TODO: when animation is resumed after a pause, the arm jumps */
        var r_angle = Math.cos(now * Math.sqrt((9.8 / 8)));
		var l_angle = -Math.cos(now * Math.sqrt((9.8 / 8)));

    	//right upperarm motion
		rarm_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(r_angle)));
        rarm_cf.decompose (tran, quat, vscale);
        rarm.position.copy(tran);
        rarm.quaternion.copy(quat);
	
		//left upperarm motion
        larm_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(l_angle)));
        larm_cf.decompose (tran, quat, vscale);
        larm.position.copy(tran);
        larm.quaternion.copy(quat);

		//right forearm motion
		rfarm_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(r_angle)));
		rfarm_cf.decompose(tran, quat, vscale);
        rfarm.position.copy(tran);
        rfarm.quaternion.copy(quat);
		
		//left forearm motion
		lfarm_cf.multiply(new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(l_angle)));
		lfarm_cf.decompose(tran, quat, vscale);
        lfarm.position.copy(tran);
        lfarm.quaternion.copy(quat);

	});
	
	
	/********************************************************************
	Keyboard Controls
	********************************************************************/
	var mouse	= {x : 0, y : 0};
	document.addEventListener('mousemove', function(event){
		mouse.x	= ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
		mouse.y	= 1 - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height);
	}, false);

    document.addEventListener('keypress', function(event){
        var key = String.fromCharCode(event.keyCode || event.charCode);
       	//alert(key);	//uncomment to debug keystrokes
	
		if (key == 'p') {
            pauseAnim ^= true; /* toggle it */
        }
		
		//Camera control keys
		if (key == '&') {
        	camera_cf.multiply(new THREE.Matrix4().makeTranslation(0, 0, -1));
        }
        if (key == '(') {
        	camera_cf.multiply(new THREE.Matrix4().makeTranslation(0, 0, 1));
        }
        if (key == '%') {
        	camera_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(3)));
        }
        if (key == '\'') {
        	camera_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(-3)));
        }
		
		//Bot control keys
			
		if (key == 'w') {
        	frame_cf.multiply(new THREE.Matrix4().makeTranslation(-1, 0, 0));
        	if(frame.position.x <= block.position.x + 10 && 
			frame.position.x >= block.position.x - 10 &&
			frame.position.z <= block.position.z + 10 && 
			frame.position.z >= block.position.z - 10){
				var x = Math.floor((Math.random() * 100) + 1);
			    var z = Math.floor((Math.random() * 100) + 1);
			    if(x > 50)
    				x = (-x) + 50;
   				if(z > 50)
    				z = (-z) + 50;
    			block.position.x = x;
    			block.position.z = z;
    			collcount++;
			} 
        }
        if (key == 's') {
        	frame_cf.multiply(new THREE.Matrix4().makeTranslation(1, 0, 0));
        	if(frame.position.x <= block.position.x + 10 && 
			frame.position.x >= block.position.x - 10 &&
			frame.position.z <= block.position.z + 10 && 
			frame.position.z >= block.position.z - 10){
				var x = Math.floor((Math.random() * 100) + 1);
			    var z = Math.floor((Math.random() * 100) + 1);
			    if(x > 50)
    				x = (-x) + 50;
   				if(z > 50)
    				z = (-z) + 50;
    			block.position.x = x;
    			block.position.z = z;
    			collcount++;
			} 
        }
        if (key == 'a') {
        	frame_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(10)));
        }
        if (key == 'd') {
        	frame_cf.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(-10)));
        }
    }, false);
	
	onRenderFcts.push(function(delta, now){
		//camera.position.x += (mouse.x*30 - camera.position.x) * (delta*3);
		//camera.position.y += (mouse.y*30 - camera.position.y) * (delta*3);
		//camera.lookAt( scene.position )
	});


	/********************************************************************
	render the scene						
	********************************************************************/
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	});
	

	/********************************************************************
	Rendering Loop
	********************************************************************/
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		block.rotation.y += .06;
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		ctime.x = clock.getElapsedTime();
		
		//animate blocks
		block.rotation.y += .06;
		lavablock1.rotation.y += .06;
		lavablock2.rotation.y += .06;
		lavablock3.rotation.y += .06;
		lavablock4.rotation.y += .06;
		backLight.position.x = -block.position.x;
		backLight.position.z = -block.position.z;
		
		if( collcount > 4 ){
			exit(0);
		}
		
		document.getElementById("score").innerHTML = collcount;

		
		if(hit == false){
			if(switcho == false){
				lavablock1.position.z += .25;
				lavablock2.position.z -= .25;
				lavablock3.position.x += .25;
				lavablock4.position.x -= .25;
			}else{
				lavablock1.position.z -= .25;
				lavablock2.position.z += .25;
				lavablock3.position.x -= .25;
				lavablock4.position.x += .25;
			}
		}
		if(lavablock1.position.z == 50){
			switcho = true;
		}
		if(lavablock1.position.z == -50){
			switcho = false;
		}
		
		if(frame.position.x <= lavablock1.position.x + 12 && 
			frame.position.x >= lavablock1.position.x - 12 &&
			frame.position.z <= lavablock1.position.z + 12 && 
			frame.position.z >= lavablock1.position.z - 12){
			hit = true;
			exit(0);
		}
		if(frame.position.x <= lavablock2.position.x + 12 && 
			frame.position.x >= lavablock2.position.x - 12 &&
			frame.position.z <= lavablock2.position.z + 12 && 
			frame.position.z >= lavablock2.position.z - 12){
			hit = true;
			exit(0);	
		}
		if(frame.position.x <= lavablock3.position.x + 12 && 
			frame.position.x >= lavablock3.position.x - 12 &&
			frame.position.z <= lavablock3.position.z + 12 && 
			frame.position.z >= lavablock3.position.z - 12){
			hit = true;
			exit(0);
		}
		if(frame.position.x <= lavablock4.position.x + 12 && 
			frame.position.x >= lavablock4.position.x - 12 &&
			frame.position.z <= lavablock4.position.z + 12 && 
			frame.position.z >= lavablock4.position.z - 12){
			hit = true;
			exit(0);	
		}

		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(f){
			f(deltaMsec/1000, nowMsec/1000)
		})
	})
});
