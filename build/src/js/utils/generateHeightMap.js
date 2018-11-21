// generateHeightMap.js

import alfrid from 'alfrid';
import Config from '../Config';
import FboPingPong from './FboPingPong';
import Assets from '../Assets';

import fs from 'shaders/treeHeight.frag';
import fsHill from 'shaders/hill.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}
let fbo, shader, shaderHill, mesh;


const generateHeightMap = (trees) => {
	let size = 1024;
	if(!fbo) {
		fbo        = new FboPingPong(size, size, {minFilter:GL.LINEAR_MIPMAP_NEAREST});	
		shader     = new alfrid.GLShader(alfrid.ShaderLibs.bigTriangleVert, fs);
		shaderHill = new alfrid.GLShader(alfrid.ShaderLibs.bigTriangleVert, fsHill);
		mesh       = alfrid.Geom.bigTriangle();
	}
	
	
	const floorSize = Config.floorRadius;

	fbo.read.bind();
	GL.clear(0, 0, 0, 1);
	fbo.read.unbind();

	//	generate height
	fbo.write.bind();
	GL.clear(0, 0, 0, 1);
	shaderHill.bind();
	shaderHill.uniform("uSeed", "float", Math.random() * 0xFF);
	shaderHill.uniform("uNoiseScale", "float", random(2, 5));
	GL.draw(mesh);
	fbo.write.unbind();

	fbo.swap();
	


	let i = trees.length;
	while(i --) {
		let pos = trees[i];
		let u = pos[0] / floorSize * .5 + .5;
		let v = 1.0 - (pos[2] / floorSize * .5 + .5);


		fbo.write.bind();
		GL.clear(0, 0, 0, 0);
		shader.bind();
		shader.uniform("texture", "uniform1i", 0);
		fbo.readTexture.bind(0);
		shader.uniform("uPos", "vec2", [u, v]);
		shader.uniform("uHeight", "float", Math.random());
		shader.uniform("uRange", "float", random(0.05, 0.1));
		shader.uniform("uPower", "float", random(2, 3));
		GL.draw(mesh);
		fbo.write.unbind();

		fbo.swap();
	}

	return fbo.readTexture;
}


export { generateHeightMap };