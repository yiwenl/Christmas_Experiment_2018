// addControls.js

import Settings from '../Settings';
import Config from '../Config';
import { saveJson } from '../utils';


const simulateKey = (keyCode, type, modifiers) => {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";	
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;
	
	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

export default (scene) => {
	setTimeout(()=> {
		console.log('setup gui');
		// gui.add(Config, 'numTrees', 1, 100).step(1).onFinishChange(Settings.reload);
		// gui.add(Config, 'treeScale', 0, 5).onChange(Settings.refresh);
		// gui.add(Config, 'floorRadius', 1, 5).onFinishChange(Settings.reload);
		// gui.add(Config, 'maxFloorHeight', 0, 1).onFinishChange(Settings.refresh);
		// gui.add(Config, 'treeBumpHeight', 0, 1).onFinishChange(Settings.reload);
		gui.add(Config, 'numSlides', 1, 1000).step(1).onFinishChange(Settings.reload);
		// gui.add(Config, 'noiseScale', 1, 10).onFinishChange(Settings.reload);
		// gui.add(Config, 'overlayOpacity', 0, 1).onChange(Settings.refresh);
		// gui.add(Config, 'bloomStrength', 0, 1).onChange(Settings.refresh);
		// gui.add(Config, 'fogMovingSpeed', 0, 1).onChange(Settings.refresh);
		// gui.add(Config, 'pixelateMixing', 0, 1).onChange(Settings.refresh);
		// gui.add(Config, 'snowSpeed', 0, 1).onChange(Settings.refresh);
		// gui.add(Config, 'showSnow').name('Show Snow').onChange(Settings.refresh);
		// gui.add(Config, 'gradientMap', 0, 1).name('Gradient Map').onChange(Settings.refresh);
		// gui.add(Config, 'fxaa').name('Post Effect').onChange(Settings.refresh);
		// gui.add(scene, 'resetCamera');


		const o = {
			saveSettings:() => {
				saveJson(Config, 'xmas-settings');
			}
		}

		// gui.add(o, 'saveSettings').name('Save Settings');
		setTimeout(()=> {
			// simulateKey(72);
		}, 500);
		
	}, 500);
}