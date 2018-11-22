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
		let s = Config.floorRadius * 2;
		this.mesh = alfrid.Geom.plane(s, s, 1);

		const { numSlides } = Config;
		this.matrices = [];

		for(let i=0; i<numSlides; i++) {
			const mtx = mat4.create();
			let z = (i/numSlides - 0.5) * s;
			mat4.translate(mtx, mtx, vec3.fromValues(0, s/2, z));
			this.matrices.push(mtx);
		}

		this.offset = 0.5;


		// setTimeout(()=> {
		// 	gui.add(this, 'offset', 0, 1);
		// }, 600);
	}


	render(texture) {
		GL.enableAdditiveBlending();
		this.shader.bind();
		this.shader.uniform("uOffset", "float", this.offset);
		this.shader.uniform("uNum", "float", Config.noiseNum);
		this.shader.uniform("uNumSlices", "float", Config.numSlides);
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);

		this.matrices.forEach( mtx => {
			this.shader.uniform("uLocalMatrix", "mat4", mtx);
			GL.draw(this.mesh);	
		});
		GL.enableAlphaBlending();
	}


}

export default ViewFog;