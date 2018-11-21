// ViewPlanes.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/planes.vert';
import fs from 'shaders/planes.frag';


var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewPlanes extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		let size = 2;
		this.mesh = alfrid.Geom.plane(size, size, 1);
		this.offset = new alfrid.EaseNumber(0, 0.01);
		// this.offset = new alfrid.TweenNumber(0, 'linear');
		this.reset();
	}


	open() {
		this.offset.setTo(0);

		setTimeout(()=> {
			this.offset.value = 1;
		}, 500);
		
	}


	reset() {
		let i = 1000;
		let positions = [];
		let extras = [];
		let r = 3.5;

		while(i--) {
			positions.push([random(-r, r), random(-r/2, r), random(-r, r)])
			extras.push([Math.random(), Math.random(), Math.random()]);
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(extras, 'aExtra');
	}


	render(mMatrix, mTexture) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		mTexture.bind(0);
		this.shader.uniform("uMatrix", "mat4", mMatrix);
		this.shader.uniform("uOffset", "float", this.offset.value);
		GL.draw(this.mesh);
	}


}

export default ViewPlanes;