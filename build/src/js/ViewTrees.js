// ViewTrees.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import Config from './Config';

import { parse } from './GLTFParser';

import vs from 'shaders/trees.vert';
import fs from 'shaders/depth.frag';

class ViewTrees extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mtx = mat4.create();
		this.mesh = [];

		const getMesh = (gltf) => {
			const nodes = gltf.nodes.filter( node => node.name !== 'Camera' && node.name !== 'Lamp');
			const rotation = quat.clone(nodes[0].rotation);
			mat4.fromQuat(this.mtx, rotation);
		}


		const addMesh = (id) => {
			let gltf = Assets.get(`${id}`);
			let bin = Assets.get(`${id}_bin`);

			parse(gltf, bin)
			.then( o => {
				this.mesh.push(o.output.meshes[0]);

				getMesh(o);
			}, err => {
				console.log('Error :', err);
			});			
		}


		addMesh('tree01');
		addMesh('tree02');
	}

	reset(trees) {
		if(this.mesh.length < 2) {
			alfrid.Scheduler.next(()=>this.reset(trees));
			return;
		}

		let i = trees.length;
		let half = i/2;

		const data1 = [];
		const data2 = [];

		while(i--) {
			let pos = trees[i];
			if(i<half) {
				data1.push([pos[0], pos[2], Math.random(), Math.random() * Math.PI * 2]);
			} else {
				data2.push([pos[0], pos[2], Math.random(), Math.random() * Math.PI * 2]);
			}
		}


		this.mesh[0].bufferInstance(data1, 'aPosOffset');
		this.mesh[1].bufferInstance(data2, 'aPosOffset');
	}


	render(mCamPos) {
		if(this.mesh.length < 2) {
			return;
		}
		this.shader.bind();
		this.shader.uniform("uLocalMatrix", "mat4", this.mtx);
		this.shader.uniform("uTreeScale", "float", Config.treeScale);
		this.shader.uniform("uCamPos", "vec3", mCamPos);
		GL.draw(this.mesh);
	}


}

export default ViewTrees;