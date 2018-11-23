// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import Settings from './Settings';
import Config from './Config';
import Noise3DTexture from './Noise3DTexture';
import Noise3D from './Noise3D';

import { generateTrees, generateHeightMap } from './utils';

import ViewFloor from './ViewFloor';
import ViewTrees from './ViewTrees';
import ViewPlanes from './ViewPlanes';
import ViewBg from './ViewBg';
import ViewGround from './ViewGround';
import ViewFog from './ViewFog';
import ViewFXAA from './ViewFXAA';
import ViewAnimal from './ViewAnimal';
import PassBloom from './PassBloom';

import addControls from './debug/addControls';

const fboScale = 1.5;
const interval = 15;

class SceneApp extends Scene {
	constructor() {
		Settings.init();

		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.radius.value = 5;
		this.orbitalControl.radius.limit(3, 6);
		this.orbitalControl.rx.limit(-.1, .2);

		this.mtx = mat4.create();
		mat4.translate(this.mtx, this.mtx, vec3.fromValues(0, -1, 0));

		//	setup front camera for projection
		this.cameraFront = new alfrid.CameraPerspective();
		const fov = 45 * Math.PI / 180;
		this.camera.setPerspective(fov, GL.aspectRatio, 1, 15);
		this.cameraFront.setPerspective(fov, GL.aspectRatio, 1, 15);
		this.cameraFront.lookAt([0, 0, 5], [0, 0, 0]);

		this._mtxFront = mat4.create();
		mat4.mul(this._mtxFront, this.cameraFront.projection, this.cameraFront.matrix);

		this._isInTransition = false;
		this._resizeTimeout = 0;
		this._count = 0;

		window.addEventListener('keydown', (e)=> {
			if(e.keyCode === 32) {
				this.next();
			}
		});

		addControls(this);
	}

	_initTextures() {
		

		this._fboCapture = new alfrid.FrameBuffer(GL.width, GL.height, {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR
		});

		this._fboRender = new alfrid.FrameBuffer(GL.width * fboScale, GL.height * fboScale);

		this._noise3D = new Noise3DTexture(Config.noiseNum, Config.noiseScale);
		this._noise3D.render();

		this._noises = new Noise3D();
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bBall = new alfrid.BatchBall();

		this._vFloor  = new ViewFloor();
		this._vTrees  = new ViewTrees();
		this._vPlanes = new ViewPlanes();
		this._vBg     = new ViewBg();
		this._vAnimal = new ViewAnimal();
		this._vGround = new ViewGround();
		this._vFog    = new ViewFog();
		this._vFxaa   = new ViewFXAA();

		this._passBloom = new PassBloom(3);

		this._resetTreePosition();
	}


	next() {
		console.log('next');
		const animals = ['deer', 'whale'];
		let index = animals.indexOf(Config.animal);
		index++;
		if(index >= animals.length) {
			index = 0;
		}

		// let g = 0.5;
		//	take screen shot of current frame
		this._fboCapture.bind();
		GL.clear(0, 0, 0, 1);
		GL.setMatrices(this.camera);
		this.renderScene();
		this._fboCapture.unbind();

		//	set flag to start rendering the planes
		this._isInTransition = true;

		//	set camera position to front
		this.orbitalControl.rx.setTo(0);
		this.orbitalControl.ry.setTo(0);
		this.orbitalControl.radius.setTo(5);

		//	move camera to side to hide the planes

		//	reset planes position
		this._vPlanes.reset();
		this._vPlanes.open();

		Config.animal = animals[index];
		Settings.refresh();
		this._vAnimal.setAnimal(animals[index]);

		this._resetTreePosition();

		//	when camera in position ( planes not visible )
		//	disable rendering the planes
		
	}


	_resetTreePosition() {
		this._trees = generateTrees();
		this._vTrees.reset(this._trees);
		this._textureFloor = generateHeightMap(this._trees);
	}


	resetCamera() {
		//	set camera position to front
		this.orbitalControl.rx.setTo(0);
		this.orbitalControl.ry.setTo(0);
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

		this._fboRender.bind();
		GL.clear(0, 0, 0, 1);
		this.renderScene();

		if(this._isInTransition) {
			this._vPlanes.render(this._mtxFront, this._fboCapture.getTexture());
		}

		this._fboRender.unbind();

		this._passBloom.render(this._fboRender.getTexture());

		if(Config.fxaa) {
			this._vFxaa.render(this._fboRender.getTexture(), this._passBloom.getTexture());
		} else {
			this._bCopy.draw(this._fboRender.getTexture());	
		}
		

		// GL.disable(GL.DEPTH_TEST);
		// let s = 200;

		// if(this._isInTransition) {
		// 	GL.viewport(s, 0, s, s/GL.aspectRatio);
		// 	this._bCopy.draw(this._fboCapture.getTexture());
		// }

		// GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this._noises.texture0);
		// GL.viewport(s, 0, s, s);
		// this._bCopy.draw(this._noises.texture1);
		// GL.enable(GL.DEPTH_TEST);
	}


	renderScene() {
		GL.rotate(this.mtx);

		this._vBg.render();
		this._vGround.render();
		this._vFloor.render(this._textureFloor);
		this._vTrees.render();
		this._vAnimal.render();
		// let s = .2;
		// this._bBall.draw([0, 0, 0], [s, s, s], [1, 1, 0]);
		// this._vFog.render(this._noise3D.getTexture());
		this._vFog.render(this._noises.texture0, this._noises.texture1, this._count / interval);

	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);

		if(this.cameraFront) {
			this.cameraFront.setAspectRatio(GL.aspectRatio);	
			mat4.identity(this._mtxFront, this._mtxFront);
			mat4.mul(this._mtxFront, this.cameraFront.projection, this.cameraFront.matrix);
		}

		if(this._resizeTimeout !== 0) {
			clearTimeout(this._resizeTimeout);
		}

		this._resizeTimeout = setTimeout(()=> {
			this._fboCapture = new alfrid.FrameBuffer(GL.width, GL.height, {
				minFilter:GL.LINEAR,
				magFilter:GL.LINEAR
			});

			this._fboRender = new alfrid.FrameBuffer(GL.width * fboScale, GL.height * fboScale);
		}, 1000/60 * 5)
		
	}
}


export default SceneApp;