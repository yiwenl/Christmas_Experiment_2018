// ViewBg.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';
import vs from 'shaders/bg.vert';
import fs from 'shaders/bg.frag';

class ViewBg extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		// const radius = Config.floorRadius * Math.sqrt(2);
		const radius = Config.floorRadius * 2.5;
		this.mesh = alfrid.Geom.sphere(radius, 12, true);
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewBg;