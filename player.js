import Character from './character.js';
import { Key } from './resources.js';
import { min, max } from './helpers.js';

const controller = {
	Space: new Key('Space'),
	KeyW: new Key('KeyW'),
	KeyA: new Key('KeyA'),
	KeyS: new Key('KeyS'),
	KeyD: new Key('KeyD')
};

window.addEventListener('keydown', (event) => {
	const { code } = event;
	controller[code] = new Key(code, 'down');
}, false);

window.addEventListener('keyup', (event) => {
	const { code } = event;
	controller[code] = new Key(code, 'up');
}, false);

const img = new Image();
img.src = 'resources/green.png';

const player = new Character({ x: 64, y: 64 }, { width: 64, height: 64 }, 16, 16);

player.draw = (context) => {
	context.drawImage(img, player.position.x, player.position.y, player.dimensions.width, player.dimensions.height);
};

player.animate = (game) => {
	// handle gravity
	if (player.boundingBottom + player.velocity.y.current < game.dimensions.height) {
		player.position.y += Math.trunc(player.velocity.y.current * game.gravity);
	} else {
		player.position.y = game.dimensions.height - player.dimensions.height;
		player.velocity.y.current = 0;
	}

	// handle increasing velocity
	if (player.boundingBottom < game.dimensions.height) {
		if (player.velocity.y.current < player.velocity.y.max) {
			player.velocity.y.current += 0.20;
		}
	}

	// handle jumping
	if (controller.KeyW.state === 'down' || controller.Space.state === 'down') {
		if (player.boundingBottom === game.dimensions.height && player.velocity.y.current === 0) {
			player.velocity.y.current = -Math.abs(player.jumpHeight);
		}
	}

	// handle walking controls
	if (controller.KeyA.state === 'down') player.controls.walking.direction = 'left';
	if (controller.KeyD.state === 'down') player.controls.walking.direction = 'right';
	if (controller.KeyA.state === 'down' && controller.KeyD.state === 'down' || controller.KeyA.state !== 'down' && controller.KeyD.state !== 'down') {
		delete player.controls.walking.direction;
	}

	// handle walking velocity
	if (player.controls.walking.direction) {
		if (player.controls.walking.direction === 'left') {
			player.velocity.x.current = min((player.velocity.x.current + -Math.abs(player.acceleration)), -Math.abs(player.velocity.x.max));
		}

		if (player.controls.walking.direction === 'right') {
			player.velocity.x.current = max((player.velocity.x.current + player.acceleration), player.velocity.x.max);
		}
	} else {
		// handle friction
		if (player.boundingBottom === game.dimensions.height) {
			player.velocity.x.current = player.velocity.x.current * 0.90;
			if (Math.abs(player.velocity.x.current) < 0.01) {
				player.velocity.x.current = 0;
			}
		}
	}

	// handle movement
	if (player.boundingRight + player.velocity.x.current >= game.boundingRight) {
		player.position.x = game.boundingRight - player.dimensions.width;
		player.velocity.x.current = 0;
	} else if (player.boundingLeft + player.velocity.x.current <= game.boundingLeft) {
		player.position.x = game.boundingLeft;
		player.velocity.x.current = 0;
	} else {
		player.position.x += Math.trunc(player.velocity.x.current);
	}
};

export default player;
