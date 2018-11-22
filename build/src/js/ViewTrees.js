// ViewTrees.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/trees.vert';
import fs from 'shaders/depth.frag';

class ViewTrees extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		// this.mesh = Assets.get('pillar');
		this.mesh1 = Assets.get('tree1');
		this.mesh2 = Assets.get('tree2');

		this.mesh = [this.mesh1, this.mesh2];
	}

	reset(trees) {

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


		this.mesh1.bufferInstance(data1, 'aPosOffset');
		this.mesh2.bufferInstance(data2, 'aPosOffset');
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewTrees;