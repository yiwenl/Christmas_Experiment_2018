// ViewWaterSurface.js

import alfrid, { GL } from 'alfrid';
import Config from './Config';

class ViewWaterSurface extends alfrid.View {
	
	constructor() {
		super();
	}


	_init() {
		let s = Config.floorSize * 2;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewWaterSurface;