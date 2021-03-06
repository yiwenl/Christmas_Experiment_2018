// addControls.js

import Settings from '../Settings';
import Config from '../Config';

export default (scene) => {
	setTimeout(()=> {
		gui.add(Config, 'numTrees', 1, 100).step(1).onFinishChange(Settings.reload);
		gui.add(Config, 'treeScale', 0, 5).onChange(Settings.refresh);
		gui.add(Config, 'floorRadius', 1, 5).onFinishChange(Settings.reload);
		gui.add(Config, 'maxFloorHeight', 0, 1).onFinishChange(Settings.refresh);
		gui.add(Config, 'treeBumpHeight', 0, 1).onFinishChange(Settings.reload);
		gui.add(Config, 'numSlides', 1, 50).step(1).onFinishChange(Settings.reload);
		gui.add(Config, 'noiseScale', 1, 10).onFinishChange(Settings.reload);
		gui.add(Config, 'overlayOpacity', 0, 1).onChange(Settings.refresh);
		gui.add(Config, 'bloomStrength', 0, 1).onChange(Settings.refresh);
		gui.add(Config, 'fxaa').name('Post Effect').onChange(Settings.refresh);
		gui.add(scene, 'resetCamera');
	}, 500);
}