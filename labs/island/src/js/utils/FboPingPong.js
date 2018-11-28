// FboPingPong.js
import alfrid from 'alfrid';

class FboPingPong {
	constructor(width, height, settings) {
		const a = new alfrid.FrameBuffer(width, height, settings);
		const b = new alfrid.FrameBuffer(width, height, settings);
		this._fbos = [a, b];
	}


	swap() {
		this._fbos.reverse();
	}


	get read() {
		return this._fbos[0];
	}

	get write() {
		return this._fbos[1];
	}


	get readTexture() {
		return this._fbos[0].getTexture();
	}


	get writeTexture() {
		return this._fbos[1].getTexture();
	}
}


export default FboPingPong;