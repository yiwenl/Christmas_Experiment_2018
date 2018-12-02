// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
// import Settings from './Settings';
import Config from './Config';
import Noise3D from './Noise3D';

import { generateTrees, generateHeightMap } from './utils';

import ViewFloor from './ViewFloor';
import ViewTrees from './ViewTrees';
import ViewBg from './ViewBg';
import ViewGround from './ViewGround';
import ViewFog from './ViewFog';
import ViewFXAA from './ViewFXAA';
import ViewAnimal from './ViewAnimal';
import ViewSquares from './ViewSquares';
import ViewCover from './ViewCover';
import ViewSnow from './ViewSnow';
import PassBloom from './PassBloom';
import SoundManager from './SoundManager';

import addControls from './debug/addControls';
import { TweenLite } from "gsap/TweenMax";

let fboScale = 1;
const interval = 25;

var random = function(min, max) { return min + Math.random() * (max - min);	}

class SceneApp extends Scene {
	constructor() {

		if(GL.isMobile) {
			fboScale = 0.8;
		}
		// Settings.init();

		Config.showSnow = false;
		// Settings.refresh();

		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.radius.value = 5;
		this.orbitalControl.radius.limit(5, 5);
		this.orbitalControl.rx.limit(-.15, .0);
		const easing = 0.05;
		this.orbitalControl.rx.easing = easing;
		this.orbitalControl.ry.easing = easing;

		this.mtx = mat4.create();
		mat4.translate(this.mtx, this.mtx, vec3.fromValues(0, -1.1, 0));

		//	setup front camera for projection
		this.cameraFront = new alfrid.CameraPerspective();
		const fov = 50 * Math.PI / 180;
		const far = 15;
		const near = 1;
		this.camera.setPerspective(fov, GL.aspectRatio, near, far);
		this.cameraFront.setPerspective(fov, GL.aspectRatio, near, far);
		this.cameraFront.lookAt([0, 0, 5], [0, 0, 0]);

		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		this._mtxFront = mat4.create();
		mat4.mul(this._mtxFront, this.cameraFront.projection, this.cameraFront.matrix);
		mat4.mul(this._mtxFront, this._biasMatrix, this._mtxFront);
		this._vSquares.setMatrices(this.cameraFront);

		this._isInTransition = false;
		this._hasOpened = false;
		this._resizeTimeout = 0;
		this._count = 0;

		window.addEventListener('keydown', (e)=> {
			if(e.keyCode === 32) {
				this.next();
			}
		});


		this._haslocked = false;
		this._angles = {
			x:0, 
			y:0
		}


		window.addEventListener('touchend', () => {
			if(Math.random() > .8 && !this._haslocked) {

				this.next();
				this._haslocked = true;

				setTimeout(()=> {
					this._haslocked = false;
				}, 15000);
			}
		});

		// addControls(this);
	}

	open() {
		this._vOpeningCover.close();
	}

	_initTextures() {
		this._fboCapture = new alfrid.FrameBuffer(GL.width, GL.height, {
			minFilter:GL.LINEAR,
			magFilter:GL.LINEAR
		});

		this._fboRender = new alfrid.FrameBuffer(GL.width * fboScale, GL.height * fboScale);
		this._fboTemp = new alfrid.FrameBuffer(GL.width * fboScale, GL.height * fboScale);

		this._noises = new Noise3D(Config.noiseNum, Config.noiseScale);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bBall = new alfrid.BatchBall();

		this._vFloor    = new ViewFloor();
		this._vTrees    = new ViewTrees();
		this._vBg       = new ViewBg();
		this._vAnimal   = new ViewAnimal();
		this._vSnow     = new ViewSnow();
		this._vGround   = new ViewGround();
		this._vFog      = new ViewFog();
		this._vFxaa     = new ViewFXAA();
		this._vSquares  = new ViewSquares();
		this._vCover    = new ViewCover();
		this._vOpeningCover = new ViewCover();
		this._vOpeningCover.opacity.setTo(1);
		this._passBloom = new PassBloom(3);

		this._resetTreePosition();
	}


	next() {
		if(!document.body.classList.contains('hasInteract')) {
			document.body.classList.add('hasInteract');
		}
		// this.orbitalControl.lock(true);
		this._angles.x *= 0.1;
		this._angles.y *= 0.1;

		this._angles.x *= 0;
		this._angles.y *= 0;
		
		const animals = ['deer', 'laputa', 'whale', 'bear'];
		let index = animals.indexOf(Config.animal);
		index++;
		if(index >= animals.length) {
			index = 0;
		}

		// let g = 0.5;
		//	take screen shot of current frame
		this._fboCapture.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);
		this.renderScene();
		this._fboCapture.unbind();


		//	set flag to start rendering the planes
		this._hasOpened = false;
		this._isInTransition = true;

		//	set camera position to front
		this.orbitalControl.rx.setTo(0);
		this.orbitalControl.ry.setTo(0);
		this.orbitalControl.radius.setTo(5);
		this.orbitalControl._loop();
		this.orbitalControl.lock(true);
		//	move camera to side to hide the planes

		//	reset planes position
		this._vSquares.reset();
		this._vSquares.open();

		Config.animal = animals[index];
		// Settings.refresh();
		this._vAnimal.setAnimal(animals[index]);

		this._resetTreePosition();
		this._capture();

		setTimeout(() => {
			this._vCover.open();
		}, 1000);

		setTimeout(() => {
			TweenLite.killTweensOf(this._angles);
			TweenLite.to(this._angles, 3, {"x":-0.1, "y":random(-0.3, 0.3), ease: Circ.easeInOut});
			
			this._vSquares.close();
			this._vCover.close();
			this._hasOpened = true;
		}, 3000);


		setTimeout(() => {
			this._isInTransition = false;
			this._angles.x = this._angles.y = 0;
			this.orbitalControl.lock(false);
		}, 6000);

		//	when camera in position ( planes not visible )
		//	disable rendering the planes
	}


	_capture() {
		this._fboTemp.bind();
		GL.clear(0, 0, 0, 1);
		GL.setMatrices(this.camera);
		this.renderScene();
		this._fboTemp.unbind();
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

		if(this._isInTransition) {
			this.orbitalControl.rx.setTo(this._angles.x);
			this.orbitalControl.ry.setTo(this._angles.y);
		}
		GL.clear(0, 0, 0, 1);

		if(this._isInTransition && this._hasOpened) {
			this._capture();
		}


		this._fboRender.bind();
		GL.clear(0, 0, 0, 1);

	
		if(this._isInTransition) {
			GL.disable(GL.DEPTH_TEST);
			if(this._hasOpened) {
				this._bCopy.draw(this._fboTemp.getTexture());
			} else {
				this._bCopy.draw(this._fboCapture.getTexture());	
			}
			
			this._vCover.render();

			GL.enable(GL.DEPTH_TEST);
			GL.rotate(this.mtx);
			this._vSquares.render(this._mtxFront, this._fboCapture.getTexture());
		} else {
			this.renderScene();	
		}

		this._fboRender.unbind();

		this._passBloom.render(this._fboRender.getTexture());

		if(Config.fxaa) {
			this._vFxaa.render(this._fboRender.getTexture(), this._passBloom.getTexture());
		} else {
			this._bCopy.draw(this._fboRender.getTexture());	
		}

		GL.disable(GL.DEPTH_TEST);
		this._vOpeningCover.render();
		GL.enable(GL.DEPTH_TEST);
	}


	renderScene(mRenderFog=true) {
		GL.rotate(this.mtx);

		this._vBg.render();
		this._vGround.render();
		this._vFloor.render(this._textureFloor);
		if(Config.showSnow) {
			this._vSnow.render();	
		}
		this._vTrees.render(this.camera.position);
		this._vAnimal.render();
		if(!GL.isMobile && mRenderFog) {
			console.time('fog');
			this._vFog.render(this._noises.texture0, this._noises.texture1, this._count / interval);	
			console.timeEnd('fog');
		}
		
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);

		if(this.cameraFront) {
			this.cameraFront.setAspectRatio(GL.aspectRatio);	
			mat4.identity(this._mtxFront, this._mtxFront);
			mat4.mul(this._mtxFront, this.cameraFront.projection, this.cameraFront.matrix);
			mat4.mul(this._mtxFront, this._biasMatrix, this._mtxFront);
			this._vSquares.setMatrices(this.cameraFront);
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
			this._fboTemp = new alfrid.FrameBuffer(GL.width * fboScale, GL.height * fboScale);
		}, 1000/60 * 5)
		
	}
}


export default SceneApp;