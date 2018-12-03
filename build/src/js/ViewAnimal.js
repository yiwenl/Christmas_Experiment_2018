// ViewAnimal.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';
import Assets from './Assets';

import { parse } from './GLTFParser';

import vs from 'shaders/animal.vert';
import fs from 'shaders/animal.frag';

class ViewAnimal extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mtx = mat4.create();
		this.setAnimal(Config.animal);
	}


	setAnimal(mId) {
		let gltf = Assets.get(`${mId}1`);
		let bin = Assets.get(`${mId}1_bin`);

		const getAnimal = (gltf) => {
			const nodes = gltf.nodes.filter( node => node.name !== 'Camera' && node.name !== 'Lamp');
			const rotation = quat.clone(nodes[0].rotation)
			mat4.fromQuat(this.mtx, rotation);
		}

		parse(gltf, bin)
		.then( o => {
			console.log('Done :', o);
			this.mesh = o.output.meshes[0];

			getAnimal(o);
		}, err => {
			console.log('Error :', err);
		});
	}


	render() {
		if(!this.mesh) {
			return;
		}
		GL.disable(GL.CULL_FACE);
		this.shader.bind();
		this.shader.uniform("uLocalMatrix", "mat4", this.mtx);
		GL.draw(this.mesh);
		GL.enable(GL.CULL_FACE);
	}


}

export default ViewAnimal;