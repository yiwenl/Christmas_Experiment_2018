// ViewAnimal.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/animal.vert';
import fs from 'shaders/animal.frag';

class ViewAnimal extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get('deer');
		this.mesh = Assets.get('whale');

		this.texture = Assets.get('env');
		this.textureNoise = Assets.get('noise');
	}


	render() {
		GL.disable(GL.CULL_FACE);
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("textureNoise", "uniform1i", 1);
		this.textureNoise.bind(1);
		GL.draw(this.mesh);
		GL.enable(GL.CULL_FACE);
	}


}

export default ViewAnimal;