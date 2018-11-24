// ViewSquares.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';
import vs from 'shaders/squares.vert';
import fs from 'shaders/squares.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewSquares extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		let size = .2;
		this.mesh = alfrid.Geom.plane(size, size, 1);
		// this.offset = new alfrid.EaseNumber(0, 0.01);
		this.offset = new alfrid.TweenNumber(0, 'linear');

		this.reset();

		setTimeout(()=> {
			gui.add(this, 'open');
			gui.add(this, 'close');
		}, 500);
	}


	reset() {
		let i = 10000;
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


	open() {
		this.offset.value = 1;
	}


	close() {
		this.offset.value = 0;
	}


	render(mMatrix, mTexture) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		mTexture.bind(0);
		this.shader.uniform("uMatrix", "mat4", mMatrix);
		this.shader.uniform("uOffset", "float", this.offset.value);
		this.shader.uniform("uMixing", "float", Config.pixelateMixing);
		GL.draw(this.mesh);
	}


}

export default ViewSquares;