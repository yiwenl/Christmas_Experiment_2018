// ViewFogs.js

import ViewFog from './ViewFog';

class ViewFogs {
	constructor() {
		this._views = [new ViewFog(), new ViewFog];
	}


	reset(mNumSlides) {
		console.log('reset');
		this.nextView.reset(mNumSlides);
	}


	swap() {
		this._views = this._views.reverse();
	}


	render(texture0, texture1, percent) {
		this.currentView.render(texture0, texture1, percent);
	}


	get currentView() {
		return this._views[0];
	}


	get nextView() {
		return this._views[1];
	}



}


export default ViewFogs;