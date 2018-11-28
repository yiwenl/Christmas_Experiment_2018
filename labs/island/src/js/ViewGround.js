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
		let s = Config.floorSize * 2;
		this.mesh = alfrid.Geom.plane(s, s, 100, 'xz');
		this._seed = Math.random() * 0xFF;
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uSeed", "float", this._seed);
		GL.draw(this.mesh);
	}


}

export default ViewGround;