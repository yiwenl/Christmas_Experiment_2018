// generateTrees.js

import Config from '../Config';
// import { getBoundingBox } from './';

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
	laputa:0.8,
	whale:0.1,
	bear:0.8,
	bull:0.8
}

const boxes = {
	deer:{left: -1.23604, right: 0.615188, front: 0.233901, back: -0.26256},
	laputa:{left: -1.12674, right: 1.12674, front: 0.42027, back: -0.318306},
	whale:{left: -0.450417, right: 1.49726, front: 2.14142, back: -2.75502},
	bear:{left: -0.518058, right: 0.518058, front: 1.241114, back: -1.241113}
}


const generateTrees = () => {
	// const mesh = Assets.get(Config.animal);
	// const box = getBoundingBox(mesh, Config.animal);
	const box = boxes[Config.animal];
	// console.log('box', box);
	const positions = [];
	const r = Config.floorRadius * 1.05;
	let i = Config.numTrees;

	const margin = margins[Config.animal] || 0.1;
	let threshold = .4;
	const angleRange = .75;
	let angleOffset = random(-angleRange, angleRange);

	while(i--) {
		let rr = 0;
		let a = 0;
		let count = 0;
		do {
			rr = Math.sqrt(Math.random()) * r;
			if(Math.random() > .2) {
				a = random(threshold, Math.PI * 2.0 - threshold) + Math.PI/2 - angleOffset;	
			} else {
				a = Math.random() * Math.PI * 2.0;
			}
			
		} while(checkBox(box, a, rr, margin) && count ++ < 100);

		positions.push([Math.cos(a) * rr, 0, Math.sin(a) * rr]);	
	}

	return positions;

}

export { generateTrees };