// ViewAnimal.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';
import Assets from './Assets';
import vs from 'shaders/animal.vert';
import fs from 'shaders/animal.frag';

class ViewAnimal extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.mesh = Assets.get(Config.animal);
	}


	setAnimal(mId) {
		this.mesh = Assets.get(mId);
	}


	render() {
		GL.disable(GL.CULL_FACE);
		this.shader.bind();
		GL.draw(this.mesh);
		GL.enable(GL.CULL_FACE);
	}


}

export default ViewAnimal;