// FullscreenAnim.js

import alfrid, { GL } from 'alfrid';

class FullscreenAnim {
	
	constructor() {
		this.canvas = document.body.querySelector('.audio-anim');
		this.width  = this.canvas.width;
		this.height = this.canvas.height;
		this.ctx    = this.canvas.getContext('2d');

		console.log('canvas', this.canvas);

		this.offset = new alfrid.EaseNumber(0);

		this._bars = [
			'TLV',
			'TLH'
		];

		alfrid.Scheduler.addEF(()=>this.loop());
	}



	loop() {
		const ctx = this.ctx;
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		const length = 5;
		const thickness = 2;

		let w, h, x, y;

		this._bars.forEach( bar => {
			if(bar.indexOf('V') > -1) {
				w = thickness;
				h = length;
			} else {
				h = thickness;
				w = length;
			}

			if(bar.indexOf('T') > -1) {
				
			}

		});

	}


}

export default FullscreenAnim;