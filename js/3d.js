import * as THREE from 'three'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

var isMobile = window.matchMedia("screen and (max-device-width: 450px) and (max-device-height: 950px)");

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let container;
let camera, scene, renderer;

let mainObject;
let loaded = false;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	//

	camera = new THREE.PerspectiveCamera( 50, aspect, 1, 10000 );
	camera.position.x = 50 * 0.68;
	camera.position.y = 50 * 0.27;
	camera.position.z = 50 * 0.68;

	//

	const controls = new OrbitControls(camera, container);
	controls.maxDistance = isMobile ? 100 : 60;
	controls.minDistance = isMobile ? 50 : 25;
	controls.maxPolarAngle = Math.PI / 2;
	controls.minPolarAngle = Math.PI / 4;
	controls.panSpeed = 0.8;
	controls.rotateSpeed = 0.8;
	controls.zoomSpeed = 0.8;

	//
	const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

	const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( ambientLight );

	//
	const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
	const loader = new OBJLoader();
	loader.load(
		'../models/test.obj',
		// called when resource is loaded
		function ( object ) {
			mainObject = object;
			scene.add(mainObject);
			mainObject.scale.x = 1;
			mainObject.scale.y = 1;
			mainObject.scale.z = 1;
			mainObject.material = material;
		},
		// called when loading is in progresses
		function ( xhr ) {
			loaded = true;
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
		},
		// called when loading has errors
		function ( error ) {
			console.log( 'OBJ loader error' );
		}
	);

	//
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( renderer.domElement );
	renderer.autoClear = false;

	//
	window.addEventListener( 'resize', onWindowResize );
	document.addEventListener( 'keydown', onKeyDown );

}

function onWindowResize() {

	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	camera.aspect = aspect;
	camera.updateProjectionMatrix();

}

function onKeyDown( event ) {

	// switch ( event.keyCode ) {

	// 	case 79: /*O*/

	// 		activeCamera = cameraOrtho;

	// 		break;

	// 	case 80: /*P*/

	// 		activeCamera = cameraPerspective;

	// 		break;

	// }

}

function animate() {
	requestAnimationFrame( animate );
	render();
}


function render() {

	if (loaded) {
		camera.lookAt(mainObject.position);
	}

	renderer.clear();

	renderer.setViewport(0, 0,SCREEN_WIDTH ,SCREEN_HEIGHT);
	renderer.render(scene, camera);
	

}