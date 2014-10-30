define([ 'vendor/babylon.1.11', 'vendor/hand-1.3.8' ], function() {
	function createSceneTuto(engine) {
	    //Creation of the scene
	    var scene = new BABYLON.Scene(engine);

	    //Adding of the light on the scene
	    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);

	    //Adding of the Arc Rotate Camera
	    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);

	    //Creation of 6 spheres
	    var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 10.0, 6.0, scene);
	    var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 2.0, 7.0, scene);//Only two segments
	    var sphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 10.0, 9.0, scene);
	    var sphere4 = BABYLON.Mesh.CreateSphere("Sphere4", 10.0, 9.0, scene);
	    var sphere5 = BABYLON.Mesh.CreateSphere("Sphere5", 10.0, 9.0, scene);
	    var sphere6 = BABYLON.Mesh.CreateSphere("Sphere6", 10.0, 9.0, scene);

	    //Positioning spheres
	    sphere1.position.x = 40;
	    sphere2.position.x = 30;
	    sphere3.position.x = 10;
	    sphere4.position.x = 0;
	    sphere5.position.x = -20;
	    sphere6.position.x = -30;

	    //Creation of a plane
	    var plan = BABYLON.Mesh.CreatePlane("plan", "120", scene);
	    plan.position.z = -10;
	    plan.rotation.y = Math.PI;

	    //Creation of a material in wireFrame
	    var materialSphere1 = new BABYLON.StandardMaterial("texture1", scene);
	    materialSphere1.wireframe = true;

	    //Creation of a red material with alpha
	    var materialSphere2 = new BABYLON.StandardMaterial("texture2", scene);
	    materialSphere2.diffuseColor = new BABYLON.Color3(1, 0, 0); //Red
	    materialSphere2.alpha = 0.3;


	    //Creation of a material with an image
	    var materialSphere3 = new BABYLON.StandardMaterial("texture3", scene);
	    materialSphere3.diffuseTexture = new BABYLON.Texture("assets/js/apps/gamesDemo/text.jpg", scene);

	    //Creation of a material, with translated texture
	    var materialSphere4 = new BABYLON.StandardMaterial("texture4", scene);
	    materialSphere4.diffuseTexture = new BABYLON.Texture("assets/js/apps/gamesDemo/text.jpg", scene);
	    materialSphere4.diffuseTexture.vOffset = 0.1;//Offset of 10% vertical
	    materialSphere4.diffuseTexture.uOffset = 0.4;//Offset of 40% horizontal

	    //Creation of a material with alpha texture
	    var materialSphere5 = new BABYLON.StandardMaterial("texture5", scene);
	    materialSphere5.diffuseTexture = new BABYLON.Texture("assets/js/apps/gamesDemo/Planet.png", scene);//Planet
	    materialSphere5.diffuseTexture.hasAlpha = true;//Have an alpha

	    //Creation of a material and allways show all the faces
	    var materialSphere6 = new BABYLON.StandardMaterial("texture6", scene);
	    materialSphere6.diffuseTexture = new BABYLON.Texture("assets/js/apps/gamesDemo/Planet.png", scene);//Planet
	    materialSphere6.diffuseTexture.hasAlpha = true;//Have an alpha
	    materialSphere6.backFaceCulling = false;//Allways show all the faces of the element



	    //Creation of a repeated textured material
	    var materialPlan = new BABYLON.StandardMaterial("texturePlane", scene);
	    materialPlan.diffuseTexture = new BABYLON.Texture("assets/js/apps/gamesDemo/grass_texture.jpg", scene);//Wood effect
	    materialPlan.diffuseTexture.uScale = 5.0;//Repeat 5 times on the Vertical Axes
	    materialPlan.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
	    materialPlan.backFaceCulling = false;//Allways show the front and the back of an element


	    //Applying the materials to the mesh
	    sphere1.material = materialSphere1;
	    sphere2.material = materialSphere2;

	    sphere3.material = materialSphere3;
	    sphere4.material = materialSphere4;

	    sphere5.material = materialSphere5;
	    sphere6.material = materialSphere6;

	    plan.material = materialPlan;

	    return scene;
	}
	var run = function() {
	    var canvas = document.getElementById("canvas");

	    // Check support
	    if (!BABYLON.Engine.isSupported()) {
	        window.alert('Browser not supported');
	    } else {
	        // Babylon
	        var engine = new BABYLON.Engine(canvas, true);

	        //Creating scene
	        scene = createSceneTuto(engine);

	        scene.activeCamera.attachControl(canvas);


	        // Once the scene is loaded, just register a render loop to render it
	        engine.runRenderLoop(function () {
	            scene.render();
	        });

	        // Resize
	        window.addEventListener("resize", function () {
	            engine.resize();
	        });
	    } 
	};
	return run;
})