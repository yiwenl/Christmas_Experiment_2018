// Noise3DTexture.js

import alfrid, { GL, GLShader, Geom } from 'alfrid';
import fs from '../shaders/noise.frag';

class Noise3DTexture {
	constructor(mNum = 8.0, mNoiseScale = 1.0, mSeed = Math.random() * 0xFF) {
		this._num = mNum;
		this.noiseScale = mNoiseScale;
		this._seed = mSeed;

		this._init();
	}


	_init() {
		this.mesh = Geom.bigTriangle();
		this.shader = new GLShader(alfrid.ShaderLibs.bigTriangleVert, fs);


		this._noiseSize = this._num * this._num;
		const fboSize = Math.pow(this._num, 3);

		this._fboNoise = new alfrid.FrameBuffer(fboSize, fboSize, {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR,
			wrapS:GL.MIRRORED_REPEAT,
			wrapT:GL.MIRRORED_REPEAT,
		});

	}


	render(mSeed) {
		this._seed += 0.003;
		this._fboNoise.bind();
		GL.clear(0, 0, 0, 0);
		const size = this._noiseSize;
		let index;
		for(let i=0; i<this._num; i++) {
			for(let j=0; j<this._num; j++) {
				GL.viewport(i * size, j * size, size, size);
				index = (i + j * this._num) / this._noiseSize;

				this.shader.bind();
				this.shader.uniform("uNoiseScale", "float", this.noiseScale);
				this.shader.uniform("uZ", "float", index);
				this.shader.uniform("uSeed", "float", mSeed || this._seed);
				GL.draw(this.mesh);
			}
		}

		this._fboNoise.unbind();
	}


	getTexture() {	return this._fboNoise.getTexture();	}

	get num() {	return this._num;	}
}


export default Noise3DTexture;