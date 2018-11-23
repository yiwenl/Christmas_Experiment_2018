// getBoundingBox.js

const caches = {}

const getBoundingBox = (mesh, id) => {
	if(caches[id]) { return caches[id]; }


	const { min, max } = Math;
	let right = -999;
	let left = 999;
	let front = -999;
	let back = 999;

	const { vertices } = mesh;

	vertices.forEach( v => {
		left = min(v[0], left);
		right = max(v[0], right);

		front = max(v[2], front);
		back = min(v[2], back);
	});


	caches[id] = {left, right, front, back};

	return caches[id];
}


export { getBoundingBox };