// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import Config from './Config';
import vs from 'shaders/floor.vert';
import fs from 'shaders/depth.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const { floorRadius } = Config;
		this.mesh = alfrid.Geom.plane(floorRadius * 2, floorRadius * 2, 100, 'xz');
	}


	render(texture) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewFloor;