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
		this.mesh = Assets.get('pillar');
	}

	reset(trees) {
		const _trees = trees.map( v => [v[0], Math.random(), v[2]]);
		this.mesh.bufferInstance(_trees, 'aPosOffset');
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewTrees;