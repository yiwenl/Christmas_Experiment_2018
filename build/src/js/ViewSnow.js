// ViewSnow.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import Config from './Config';
import vs from 'shaders/snow.vert';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewSnow extends alfrid.View {
	
	constructor() {
		super(vs, alfrid.ShaderLibs.simpleColorFrag);
	}


	_init() {
		this.mesh = Assets.get('rock');

		let num = 500;
		const positions = [];
		const extra = [];
		let r = Config.floorRadius;

		while(num--) {
			positions.push([random(-r, r), random(0, r), random(-r, r)]);
			extra.push([Math.random(), Math.random(), Math.random()]);
		}

		this.mesh.bufferInstance(positions, 'aPosOffset');
		this.mesh.bufferInstance(extra, 'aExtra');

		this.shader.bind();
		this.shader.uniform("color", "vec3", [1, 1, 1]);
		this.shader.uniform("opacity", "float", 1);
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);
		this.shader.uniform("uRadius", "float", Config.floorRadius);
		this.shader.uniform("uSpeed", "float", Config.snowSpeed);
		GL.draw(this.mesh);
	}


}

export default ViewSnow;