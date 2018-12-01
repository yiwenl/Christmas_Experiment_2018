import '../scss/global.scss';
import debugPolyfill from './debug/debugPolyfill';
import alfrid, { GL } from 'alfrid';
import SceneApp from './SceneApp';
import AssetsLoader from 'assets-loader';
import LoadingAnim from './LoadingAnim';

import assets from './asset-list';
import Assets from './Assets';
import Config from './Config';

let loadingAnim;

if(document.body) {
	_init();
} else {
	window.addEventListener('DOMContentLoaded', _init);
}


function _init() {

	loadingAnim = new LoadingAnim();


	//	LOADING ASSETS
	if(assets.length > 0) {
		document.body.classList.add('isLoading');

		const loader = new AssetsLoader({
			assets:assets
		})
		.on('error', (error)=>{
			console.log('Error :', error);
		})
		.on('progress', (p) => {
			// console.log('Progress : ', p);
			const loader = document.body.querySelector('.Loading-Bar');
			if(loader) loader.style.width = `${(p * 100)}%`;
		})
		.on('complete', _onImageLoaded)
		.start();

	} else {
		_init3D();
	}
}


function _onImageLoaded(o) {
	//	ASSETS
	console.log('Image Loaded : ', o);
	window.assets = o;
	const loader = document.body.querySelector('.Loading-Bar');
	console.log('Loader :', loader);
	loader.style.width = '100%';

	_init3D();

	setTimeout(()=> {
		document.body.classList.remove('isLoading');
	}, 250);
}


function _init3D() {
	const container = document.body.querySelector('.container');
	//	CREATE CANVAS
	const canvas = document.createElement('canvas');
	canvas.className = 'Main-Canvas';
	container.appendChild(canvas);

	//	INIT 3D TOOL
	GL.init(canvas, {ignoreWebgl2:true});
	console.log('isMobiel :', GL.isMobile);
	if(GL.isMobile) {

		var ua = navigator.userAgent;
		if(/Chrome/i.test(ua)) {
			setTimeout(()=> {
				document.body.classList.add('isMobileChrome');
			}, 1000);	
		}


		setTimeout(()=> {
			document.body.classList.add('isMobile');
		}, 1000);	
		
	}


	//	INIT ASSETS
	Assets.init();

	//	CREATE SCENE
	const scene = new SceneApp();

	//	Fullscreen
	const btnFS = document.body.querySelector('.fullscreen');
	const btnFSText = btnFS.querySelector('p');
	let isInFullScreen = false;

	btnFS.addEventListener('touchend', (e)=> {
		console.log('fullscreen');
		isInFullScreen = !isInFullScreen;

		if(isInFullScreen) {
			document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			btnFSText.innerHTML = 'Exit Fullscreen';
		} else {
			document.webkitExitFullscreen();
			btnFSText.innerHTML = 'Go Fullscreen';
		}
	});


	loadingAnim.on('onAnimClosed', () => {
		scene.open();

		setTimeout(()=> {
			document.body.classList.add('isOpened');
		}, 1000);
	});
	loadingAnim.close();
}