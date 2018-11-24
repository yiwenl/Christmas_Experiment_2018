// generateTrees.js

import Config from '../Config';
import Assets from '../Assets';
import { getBoundingBox } from './';

var random = function(min, max) { return min + Math.random() * (max - min);	}

const checkBox = (box, a, r, margin=0) => {
	let x = Math.cos(a) * r;
	let z = Math.sin(a) * r;
	const { left, right, front, back } = box;

	let hit = false;

	if(	x > (left - margin) 
		&& x < (right + margin) 
		&& z < (front + margin) 
		&& z > (back - margin)) {
		hit = true;
	} 

	return hit;
}


const margins = {
	deer:0.8,
	whale:0.1,
	bear:0.8,
	bull:0.8
}


const generateTrees = () => {
	const mesh = Assets.get(Config.animal);
	const box = getBoundingBox(mesh, Config.animal);
	const positions = [];
	const r = Config.floorRadius * 1.1;
	let i = Config.numTrees;

	const margin = margins[Config.animal] || 0.1;

	while(i--) {
		let rr = 0;
		let a = 0;
		let count = 0;
		do {
			rr = Math.sqrt(Math.random()) * r;
			a = Math.random() * Math.PI * 2.0;
		} while(checkBox(box, a, rr, margin) && count ++ < 100);

		positions.push([Math.cos(a) * rr, 0, Math.sin(a) * rr]);	
	}

	return positions;

}

export { generateTrees };