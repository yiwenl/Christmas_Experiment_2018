import '../scss/global.scss';
import debugPolyfill from './debug/debugPolyfill';
import alfrid, { GL } from 'alfrid';
import SceneApp from './SceneApp';
import AssetsLoader from 'assets-loader';
import LoadingAnim from './animations/LoadingAnim';

import assets from './asset-list';
import Assets from './Assets';
import Config from './Config';
// import Brim from './utils/Brim';

let loadingAnim, loadingBar;

if(document.body) {
	_init();
} else {
	window.addEventListener('DOMContentLoaded', _init);
}


function _init() {

	loadingAnim = new LoadingAnim();
	loadingBar = document.querySelector('.Loading-container');


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
			if(loader) loader.style.width = `${Math.floor(p * 100)}%`;
		})
		.on('complete', _onImageLoaded)
		.start();

	} else {
		_init3D();
	}
}


function _onImageLoaded(o) {
	//	ASSETS
	window.assets = o;
	const loader = document.body.querySelector('.Loading-Bar');
	loader.style.width = '100%';

	_init3D();


	loadingBar.classList.add('loaded');
}


function _init3D() {
	const container = document.body.querySelector('.container');
	//	CREATE CANVAS
	const canvas = document.createElement('canvas');
	canvas.className = 'Main-Canvas';
	container.appendChild(canvas);

	//	INIT 3D TOOL
	GL.init(canvas, {ignoreWebgl2:true});
	

	const ua = navigator.userAgent;
	if(/Chrome/i.test(ua)) {
		setTimeout(()=> {
			document.body.classList.add('isChrome');
		}, 1000);	
	}

	if(GL.isMobile) {
		setTimeout(()=> {
			document.body.classList.add('isMobile');
		}, 1000);	
	}


	//	INIT ASSETS
	Assets.init();

	//	CREATE SCENE
	const scene = new SceneApp();


	loadingAnim.on('onAnimClosed', () => {
		scene.open();
		document.body.classList.remove('isLoading');
		loadingBar.classList.add('close');

		setTimeout(()=> {

			document.body.classList.add('isOpened');
		}, 1000);
	});
	loadingAnim.close();

	setTimeout(()=> {
		window.scrollTo(0, 1);
	}, 1000)
}