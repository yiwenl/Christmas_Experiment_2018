// AudioAnim.js

import alfrid from 'alfrid';

var random = function(min, max) { return min + Math.random() * (max - min);	}

const mix = (a, b, p) => {
	return a * ( 1.0 - p) + b * p;
}

class AudioAnim {
	constructor() {
		this.canvas = document.body.querySelector('.audio-anim');
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.ctx = this.canvas.getContext('2d');
		this.multiplier = new alfrid.EaseNumber(0);

		this.bars = [];
		let i = 5;
		while(i--) {
			this.bars.push(new alfrid.EaseNumber(.5));
		}

		this.reset();

		alfrid.Scheduler.addEF(()=>this.loop());
	}


	open() {
		this.multiplier.value = 1;
	}

	close() {
		this.multiplier.value = 0;
	}


	reset() {
		this.bars.forEach(b => b.value = random(.25, .75) );

		alfrid.Scheduler.delay(()=>this.reset(), null, random(100, 300));
	}


	loop() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		const barWidth = 2;
		const gap = (this.width - barWidth * this.bars.length) / (this.bars.length - 1);
		let x, y, h;
		this.ctx.fillStyle = 'rgba(255, 255, 255, .25)';
		this.bars.forEach( (bar, i) => {
			x = (gap + barWidth) * i;
			h = mix(0.25, bar.value, mix(this.multiplier.value, 1.0, .25));
			y = 1.0 - h;
			h *= this.height;
			y *= this.height;

			this.ctx.fillRect(x, y, barWidth, h);
		});
	}
}

export default AudioAnim;