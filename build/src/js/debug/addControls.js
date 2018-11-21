// addControls.js

import Settings from '../Settings';
import Config from '../Config';

export default (scene) => {
	setTimeout(()=> {
		gui.add(Config, 'numTrees', 1, 100).onFinishChange(Settings.reload);
		gui.add(Config, 'floorRadius', 1, 5).onFinishChange(Settings.reload);
		gui.add(scene, 'resetCamera');
	}, 500);
}