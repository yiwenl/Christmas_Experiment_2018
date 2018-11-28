// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import Settings from './Settings';
import Config from './Config';

import Noise3D from './Noise3D';
import ViewFog from './ViewFog';

import ViewGround from './ViewGround';
import ViewWaterSurface from './ViewWaterSurface';

import addControls from './debug/addControls';

const interval = 15;

class SceneApp extends Scene {
	constructor() {
		Settings.init();

		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = -0.1;
		this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;

		this._count = 0;

		this._matrix = mat4.create();
		mat4.translate(this._matrix, this._matrix, vec3.fromValues(0, Config.yOffset, 0));

		const fov = 45 * Math.PI / 180;
		this.camera.setPerspective(fov, GL.aspectRatio, .1, 100);


		this._point0 = vec3.fromValues(1, 5, 1);
		this._point1 = vec3.fromValues(0, 0, 0);

		this._dir = vec3.clone(this._point0);
		vec3.normalize(this._dir, this._dir);

		console.log('this._dir', this._dir);

		addControls();
	}

	_initTextures() {
		// console.log('init textures');

		this._noises = new Noise3D(Config.noiseNum, Config.noiseScale);
	}


	_initViews() {
		// console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bLine = new alfrid.BatchLine();
		this._bBall = new alfrid.BatchBall();

		// console.log('Line :', alfrid.BatchLine);

		this._vFog = new ViewFog();
		this._vWater = new ViewWaterSurface();
		this._vGround = new ViewGround();
	}


	updateFog() {
		this._count = 0;
		this._noises.update();
	}


	render() {
		this._count ++;
		if(this._count >= interval) {
			this.updateFog();
		}

		GL.clear(0, 0, 0, 1);

		
		this._renderScene();


		// let s = 200;
		// GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this._noises.texture0);
		// GL.viewport(s, 0, s, s);
		// this._bCopy.draw(this._noises.texture1);
	}

	_renderScene() {
		GL.rotate(this._matrix);


		this._bAxis.draw();
		this._bDots.draw();

		let s = 0.1;
		let t = Config.floorSize;
		let color = [1, 1, 1];

		this._bBall.draw([ t/2, t,  t/2], [s, s, s], color);
		this._bBall.draw([-t/2, t,  t/2], [s, s, s], color);
		this._bBall.draw([-t/2, t, -t/2], [s, s, s], color);
		this._bBall.draw([ t/2, t, -t/2], [s, s, s], color);

		this._bBall.draw([ t/2, 0,  t/2], [s, s, s], color);
		this._bBall.draw([-t/2, 0,  t/2], [s, s, s], color);
		this._bBall.draw([-t/2, 0, -t/2], [s, s, s], color);
		this._bBall.draw([ t/2, 0, -t/2], [s, s, s], color);

		// this._bLine.draw(this._point0, this._point1);
		this._vWater.render();
		this._vGround.render();
		this._vFog.render(this._noises.texture0, this._noises.texture1, this._count / interval, this._dir);
		
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;