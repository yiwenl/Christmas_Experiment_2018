// SoundManager.js
import sono from 'libs/sono';
import AudioAnim from './AudioAnim';

class SoundManager {
	constructor() {
		this._hasStarted = false;
		this._isPlaying = false;

		this._btn = document.body.querySelector('.audio-toggle');
		this._btn.addEventListener('click', ()=>this.toggle());

		this._anim = new AudioAnim();
	}



	toggle() {
		console.log('Toggle music');

		if(!this._hasStarted) {
			this._sound = sono.createSound({
				src:'./assets/audio/music.mp3',
				loop: true,
				volume: 0.25
			});
			this._hasStarted = true;
		} 

		if(this._isPlaying) {
			this._sound.pause();
			this._anim.close();
		} else {
			this._sound.play();
			this._anim.open();
		}


		this._isPlaying = !this._isPlaying;
	}
}

export default new SoundManager();