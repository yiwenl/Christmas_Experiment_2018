// ViewFog.js

import alfrid, { GL } from 'alfrid';

import Config from './Config';
import vs from 'shaders/fog.vert';
import fs from 'shaders/fog.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewFog extends alfrid.View {
	
	constructor() {
		let _fs = fs.replace('${NUM}', Config.numLights);

		super(vs, _fs);
	}


	_init() {
		this.size = Config.floorSize;
		let s = this.size;
		this.mesh = alfrid.Geom.plane(s, s, 1);

		const { numSlides } = Config;
		const posOffset = [];

		for(let i=0; i<numSlides; i++) {
			let z = (i/numSlides - 0.5) * s;
			posOffset.push([0, s/2, z]);
		}

		this.mesh.bufferInstance(posOffset, 'aPosOffset');

		this.offset = 0.45;

		setTimeout(()=> {
			gui.add(this, 'offset', 0, 1);
		}, 500);


		//	uniforms

		let i = Config.numLights;
		let range = 2;
		this._lights = [];

		const pos = [];

		while(i--) {
			let r = i === Config.numLights ? 0 : random(1, 3);
			let a = Math.random() * Math.PI * 2;
			let s = i === Config.numLights ? 1 : random(.2, .5);

			this._lights.push(Math.cos(a) * r, Math.sin(a) * r, s);
			pos.push([Math.cos(a) * r, Math.sin(a) * r]);
		}

		// console.log(this._lights.length);
		console.table(pos);

	}


	render(texture0, texture1, percent, mDir) {
		GL.enableAdditiveBlending();
		this.shader.bind();
		this.shader.uniform("uPosOffset", "vec3", [0, Config.yOffset, 0]);
		this.shader.uniform("uSize", "float", this.size * 0.5);

		this.shader.uniform("uNum", "float", Config.noiseNum);
		this.shader.uniform("uNumSlices", "float", Config.numSlides);
		this.shader.uniform("uOffset", "float", this.offset);

		this.shader.uniform("texture0", "uniform1i", 0);
		texture0.bind(0);
		this.shader.uniform("texture1", "uniform1i", 1);
		texture1.bind(1);
		this.shader.uniform("uPercent", "float", percent);

		this.shader.uniform("uDir", "vec3", mDir);
		this.shader.uniform("uLights", "vec3", this._lights);

		GL.draw(this.mesh);
		GL.enableAlphaBlending();
	}


}

export default ViewFog;