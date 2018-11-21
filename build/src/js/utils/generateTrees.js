// generateTrees.js

import Config from '../Config';


var random = function(min, max) { return min + Math.random() * (max - min);	}

const generateTrees = () => {
	const positions = [];
	const r = Config.floorRadius ;
	let i = Config.numTrees;

	while(i--) {
		let rr = Math.sqrt(Math.random()) * r;
		let a = Math.random() * Math.PI * 2.0;

		positions.push([Math.cos(a) * rr, 0, Math.sin(a) * rr]);	
	}

	return positions;

}

export { generateTrees };