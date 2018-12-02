// ViewFog.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';
import vs from 'shaders/fog.vert';
import fs from 'shaders/fog.frag';

class ViewFog extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.reset(Config.numSlides);
	}


	reset(mNumSlides) {
		this._numSlides = mNumSlides;

		console.log('Setting number of slides : ', mNumSlides);

		let s = Config.floorRadius * 2;
		this.mesh = alfrid.Geom.plane(s, s, 1);

		// const { numSlides } = Config;
		const numSlides = this._numSlides;
		const posOffset = [];

		for(let i=0; i<numSlides; i++) {
			let z = (i/numSlides - 0.5) * s;
			posOffset.push([0, s/2, z]);
		}

		this.offset = 0.23;
		this.mesh.bufferInstance(posOffset, 'aPosOffset');
		console.log(posOffset.length);

	}


	render(texture0, texture1, percent) {
		GL.enableAdditiveBlending();
		this.shader.bind();
		this.shader.uniform("uOffset", "float", this.offset);
		this.shader.uniform("uNum", "float", Config.noiseNum);
		this.shader.uniform("uNumSlices", "float", this._numSlides);
		this.shader.uniform("texture0", "uniform1i", 0);
		texture0.bind(0);
		this.shader.uniform("texture1", "uniform1i", 1);
		texture1.bind(1);
		this.shader.uniform("uPercent", "float", percent);
		this.shader.uniform("uSize", "float", Config.floorRadius);

		GL.draw(this.mesh);	
		GL.enableAlphaBlending();
	}


}

export default ViewFog;