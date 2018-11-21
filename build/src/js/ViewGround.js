// ViewGround.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';
import vs from 'shaders/ground.vert';
import fs from 'shaders/ground.frag';

class ViewGround extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const r = Config.floorRadius * 4;
		this.mesh = alfrid.Geom.plane(r, r, 1, 'xz');
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewGround;