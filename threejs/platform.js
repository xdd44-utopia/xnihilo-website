import * as THREE from '../build/three.module.js'
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js'
import {scene} from './3d.js'

const material = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
const loader = new OBJLoader();

export class Platform {

	#itemObject;
	position;
	size;

	constructor(pos, size, itemPath) {

		this.position = pos;
		this.size = size;

		const geometry = new THREE.PlaneGeometry(this.size.x, this.size.y);
		const plane = new THREE.Mesh( geometry, material );

		plane.castShadow = false;
		plane.receiveShadow = true;
		plane.rotation.set(Math.PI / 2, 0, 0);

		plane.position.set(this.position.x, this.position.y, this.position.z);

		scene.add( plane );

		this.loadItem(itemPath);
	}

	loadItem(itemPath) {
		loader.load(
			itemPath,
			this.addItem.bind(this),
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			function ( error ) {
				console.log( error );
			}
		);
	}

	addItem(object) {
		this.#itemObject = object;
		this.#itemObject.material = material;
		this.#itemObject.traverse(function(child){child.castShadow = true;});
		this.#itemObject.scale.set(0.1, 0.1, 0.1);
		this.#itemObject.position.set(this.position.x, this.position.y + 2, this.position.z);
		scene.add(this.#itemObject);
	}

}