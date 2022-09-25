import Character from './character.js';
import { min, max } from './helpers.js';

const redImage = new Image();
redImage.src = 'resources/red.png';

const red = new Character({ x: 128, y: 128 }, { width: 64, height: 64 }, 16, 16);
red.draw = (context) => {
	context.drawImage(redImage, red.position.x, red.position.y, red.dimensions.width, red.dimensions.height);
};
red.animate = (game) => {
	// handle gravity
	if (red.boundingBottom + red.velocity.y.current < game.dimensions.height) {
		red.position.y += Math.trunc(red.velocity.y.current * game.gravity);
	} else {
		red.position.y = game.dimensions.height - red.dimensions.height;
		red.velocity.y.current = 0;
	}

	// handle increasing velocity
	if (red.boundingBottom < game.dimensions.height) {
		if (red.velocity.y.current < red.velocity.y.max) {
			red.velocity.y.current += 0.20;
		}
	}

	red.jump = Math.random() < 0.01;

	// handle jumping
	if (red.jump === true) {
		if (red.boundingBottom === game.dimensions.height && red.velocity.y.current === 0) {
			red.velocity.y.current = -Math.abs(red.jumpHeight);
		}
	}





	if (Math.random() < 0.005) {
		red.controls.walking.direction = 'left';
	}

	if (Math.random() < 0.005) {
		red.controls.walking.direction = 'right';
	}

	if (Math.random() < 0.01) {
		delete red.controls.walking.direction;
	}

	// handle walking velocity
	if (red.controls.walking.direction) {
		if (red.controls.walking.direction === 'left') {
			red.velocity.x.current = min((red.velocity.x.current + -Math.abs(red.acceleration)), -Math.abs(red.velocity.x.max));
		}

		if (red.controls.walking.direction === 'right') {
			red.velocity.x.current = max((red.velocity.x.current + red.acceleration), red.velocity.x.max);
		}
	} else {
		// handle friction
		if (red.boundingBottom === game.dimensions.height) {
			red.velocity.x.current = red.velocity.x.current * 0.90;
			if (Math.abs(red.velocity.x.current) < 0.01) {
				red.velocity.x.current = 0;
			}
		}
	}

	// handle movement
	if (red.boundingRight + red.velocity.x.current >= game.boundingRight) {
		red.position.x = game.boundingRight - red.dimensions.width;
		red.velocity.x.current = 0;
	} else if (red.boundingLeft + red.velocity.x.current <= game.boundingLeft) {
		red.position.x = game.boundingLeft;
		red.velocity.x.current = 0;
	} else {
		red.position.x += Math.trunc(red.velocity.x.current);
	}
};

export default red;
