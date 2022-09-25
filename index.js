import player from './player.js';
import red from './red.js';
import Entity from './entity.js';
import Background from './background.js';
import Room from './room.js';

const game = new Room({ height: 2, width: 2 });

const cam1 = document.getElementById('cam1');
const cam1Context = cam1.getContext('2d');
cam1Context.imageSmoothingEnabled = false;

const entities = [];

const background = new Background(game);

entities.push(background);
entities.push(red);
entities.push(player);

const animate = () => {
	entities.forEach((entity) => {
		entity.animate(game);
	});
};

const render = () => {
	game.context.clearRect(0, 0, game.dimensions.width, game.dimensions.height);
	entities.forEach((entity) => {
		entity.draw(game.context);
	});
	camera();
};

const gameScreen = {
	width: 0,
	height: 0
};

const setWindowSize = () => {
	gameScreen.width = window.innerWidth;
	gameScreen.height = window.innerHeight;
};

setWindowSize();

window.addEventListener('resize', setWindowSize);

const camera = () => {

	cam1.width = gameScreen.width;
	cam1.height = gameScreen.height;

	cam1Context.clearRect(0, 0, cam1.width, cam1.height);

	const pcb = new Entity(
		{
			x: player.centerPosition.x - cam1.width / 2,
			y: player.centerPosition.y - cam1.height / 2
		},
		{
			width: cam1.width,
			height: cam1.height
		}
	);

	cam1Context.drawImage(game.canvas, pcb.position.x, pcb.position.y, pcb.dimensions.width, pcb.dimensions.height, 0, 0, cam1.width, cam1.height);
};

let start;
const fps = 120;
const fpsInterval = 1000 / fps;

let lastFrameTimestamp;

const step = (timestamp) => {
	if (!start) start = timestamp;
	if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;

	if (timestamp > lastFrameTimestamp + fpsInterval) {
		lastFrameTimestamp = timestamp;
		animate();
		render();
	}

	window.requestAnimationFrame(step);
};

const init = () => {
	window.requestAnimationFrame(step);
};

init();
