// addControls.js

import Settings from '../Settings';
import Config from '../Config';
import { saveJson } from '../utils';

export default (scene) => {
	setTimeout(()=> {
		gui.add(Config, 'numTrees', 1, 100).step(1).onFinishChange(Settings.reload);
		gui.add(Config, 'treeScale', 0, 5).onChange(Settings.refresh);
		gui.add(Config, 'floorRadius', 1, 5).onFinishChange(Settings.reload);
		gui.add(Config, 'maxFloorHeight', 0, 1).onFinishChange(Settings.refresh);
		gui.add(Config, 'treeBumpHeight', 0, 1).onFinishChange(Settings.reload);
		gui.add(Config, 'numSlides', 1, 200).step(1).onFinishChange(Settings.reload);
		gui.add(Config, 'noiseScale', 1, 10).onFinishChange(Settings.reload);
		gui.add(Config, 'overlayOpacity', 0, 1).onChange(Settings.refresh);
		gui.add(Config, 'bloomStrength', 0, 1).onChange(Settings.refresh);
		gui.add(Config, 'fogMovingSpeed', 0, 1).onChange(Settings.refresh);
		gui.add(Config, 'pixelateMixing', 0, 1).onChange(Settings.refresh);
		gui.add(Config, 'gradientMap').name('Gradient Map').onChange(Settings.refresh);
		gui.add(Config, 'fxaa').name('Post Effect').onChange(Settings.refresh);
		gui.add(scene, 'resetCamera');


		const o = {
			saveSettings:() => {
				saveJson(Config, 'xmas-settings');
			}
		}

		gui.add(o, 'saveSettings').name('Save Settings');
	}, 500);
}