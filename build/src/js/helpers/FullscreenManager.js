// FullscreenManager.js
// import FullscreenAnim from '../animations/FullscreenAnim';

class FullscreenManager {

	constructor() {
		console.log('init FullscreenManager');
		const btnFSDesktop = document.body.querySelector('.fullscreen-anim');
		
		this._isInFullScreen = false;
		btnFSDesktop.addEventListener('click', () => this.toggleFullScreen() );


		document.body.addEventListener("webkitfullscreenchange", () => {
		  let delay = 500;
		  this._isInFullScreen = !this._isInFullScreen;

		  setTimeout(()=> {
		  	if(this._isInFullScreen) {
		  		document.body.classList.add('isFullscreen');	
		  	} else {
		  		document.body.classList.remove('isFullscreen');	
		  	}
		  	
		  }, delay);

		});
	}


	toggleFullScreen() {
		if(!this._isInFullScreen) {
			document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		} else {
			document.webkitExitFullscreen();
		}
	}

}

export default new FullscreenManager();