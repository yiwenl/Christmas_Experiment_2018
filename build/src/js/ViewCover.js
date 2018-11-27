// ViewCover.js

import alfrid, { GL } from 'alfrid';

class ViewCover extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
		this.opacity = new alfrid.EaseNumber(0, 0.02);
	}


	open() {
		this.opacity.value = 1;
	}


	close() {
		this.opacity.value = 0;
	}


	render() {
		if(this.opacity.value <= 0.001) {
			return;
		}
		this.shader.bind();
		this.shader.uniform("color", "vec3", [0, 0, 0]);
		this.shader.uniform("opacity", "float", this.opacity.value);
		GL.draw(this.mesh);
	}


}

export default ViewCover;