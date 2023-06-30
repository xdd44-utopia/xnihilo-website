import * as THREE from '../build/three.module.js'
import {scene} from './3d.js'

const material = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide} );

export class Connection {

	#platform1;
	#platform2;
	#mesh;

	constructor(p1, p2) {

		this.#platform1 = p1;
		this.#platform2 = p2;

		const geometry = new THREE.PlaneGeometry(1, 1);
		this.#mesh = new THREE.Mesh( geometry, material );

		this.#mesh.castShadow = false;
		this.#mesh.receiveShadow = true;

		scene.add( this.#mesh );

		this.connect();

	}

	connect() {
		let end1 = new THREE.Vector3().copy(this.#platform1.position).add(new THREE.Vector3(0, 0, this.#platform1.size.y / 2));
		let end2 = new THREE.Vector3().copy(this.#platform2.position).add(new THREE.Vector3(0, 0, - this.#platform2.size.y / 2));
		let pos = new THREE.Vector3().copy(end1).add(end2).multiplyScalar(0.5);
		this.#mesh.position.set(pos.x, pos.y, pos.z);

		let length = Math.sqrt((end2.y - end1.y)**2 + (end2.z - end1.z)**2);
		this.#mesh.scale.set(2, length);

		let angle = Math.atan((end2.y - end1.y) / (end2.z - end1.z));
		this.#mesh.rotation.set(Math.PI / 2 - angle, 0, 0);
	}

}