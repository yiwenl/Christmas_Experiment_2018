// ViewFXAA.js

import alfrid, { GL } from 'alfrid';

import Assets from './Assets';
import Config from './Config';
import fs from 'shaders/fxaa.frag';

class ViewFXAA extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
		this.textureNoise = Assets.get('noise');
		this.textureNoise.wrapS = this.textureNoise.wrapT = GL.REPEAT;
		this.textureNoise.minFilter = this.textureNoise.magFilter = GL.NEAREST;
	}


	render(texture) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		this.shader.uniform("textureNoise", "uniform1i", 1);
		this.textureNoise.bind(1);
		this.shader.uniform("uResolution", "vec2", [1/GL.width, 1/GL.height]);
		this.shader.uniform("uOverlay", "float", Config.overlayOpacity);
		GL.draw(this.mesh);
	}


}

export default ViewFXAA;