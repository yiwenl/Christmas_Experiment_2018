// addControls.js

import Config from '../Config';
import Settings from '../Settings';

export default () => {
	setTimeout(()=> {
		gui.add(Config, 'noiseScale', 1, 10).onFinishChange(Settings.reload);
		gui.add(Config, 'floorSize', 1, 10).onFinishChange(Settings.reload);
		gui.add(Config, 'numSlides', 10, 100).step(1).onFinishChange(Settings.reload);
		gui.add(Config, 'yOffset', -3, 0).onFinishChange(Settings.reload);
		gui.add(Config, 'fogMovingSpeed', 0, 1).onFinishChange(Settings.refresh);
	}, 500);
};