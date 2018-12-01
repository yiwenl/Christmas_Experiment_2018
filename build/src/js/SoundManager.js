// SoundManager.js
import sono from 'libs/sono';

class SoundManager {
	constructor() {
		this._hasStarted = false;
		this._isPlaying = false;

		this._btn = document.body.querySelector('.audio-toggle');
		this._btn.addEventListener('click', ()=>this.toggle());
	}


	fadeOut() {

	}


	faseIn() {

	}


	toggle() {
		console.log('Toggle music');

		if(!this._hasStarted) {
			this._sound = sono.createSound({
				src:'./assets/audio/music.mp3',
				loop: true
			});
			this._hasStarted = true;
		} 

		if(this._isPlaying) {
			this._sound.pause();
		} else {
			this._sound.play();
		}

		if(this._btn.classList.contains('isSoundOn')) {
			this._btn.classList.remove('isSoundOn');
		}
		this._btn.class

		this._isPlaying = !this._isPlaying;
		if(this._isPlaying) {
			this._btn.classList.add('isSoundOn');
		}
	}
}

export default new SoundManager();