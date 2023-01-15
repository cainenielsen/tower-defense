import player from './player.js';
import red from './red.js';
import Entity from './entity.js';
import Background from './background.js';
import World from './world.js';
import { Dirt } from './tiles.js';
import { getWorldListData, setWorldListData, getPlayerData, setPlayerData, getChunkData, setChunkData } from './local.js';

const mainMenu = document.getElementById('main-menu');
const createWorldButton = document.getElementById('create-world-button');
const worldList = document.getElementById('world-list');

const listWorlds = () => {
	const worldListData = getWorldListData() || [];

	worldList.innerHTML = '';

	worldListData.forEach((item) => {
		const worldListItem = document.createElement('div');
		worldListItem.textContent = item;
		worldListItem.classList.add('world-list-item');
		worldListItem.addEventListener('click', () => loadWorld(item));
		worldList.appendChild(worldListItem);
	});
};

listWorlds();

const createWorld = () => {
	const worldId = crypto.randomUUID();
	setWorldListData(worldId);
	listWorlds();
};

createWorldButton.addEventListener('click', () => createWorld());

const loadWorld = (worldId) => {
	mainMenu.style.display = 'none';

	const activeWorld = new World(worldId);

	let playerData = getPlayerData(worldId);
	if (!playerData) {
		playerData = {
			room: 'overworld',
			position: {
				x: 1000,
				y: -1000
			}
		};
		setPlayerData(worldId, playerData);
	}

	console.log({ playerData });

	const game = activeWorld.getRoom(playerData.room);

	const chunkX = Math.trunc(playerData.position.x / 16 / 2);
	const chunkY = Math.trunc(playerData.position.y / 16 / 2);

	console.log({ chunkX, chunkY });

	let chunkData = getChunkData(worldId, { x: chunkX, y: chunkY });
	if (!chunkData) {
		chunkData = {
			6: {
				4: {
					tile: 'dirt'
				}
			}
		};
		setChunkData(worldId, { x: chunkX, y: chunkY }, chunkData);
	}

	console.log({ chunkData });

	// get chunk data for nearby chunks

	const cam1 = document.getElementById('cam1');
	const cam1Context = cam1.getContext('2d');
	cam1Context.imageSmoothingEnabled = false;

	const entities = [];

	const background = new Background(game);

	entities.push(background);
	entities.push(new Dirt({ x: 512, y: 2048 - 64 }));
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
};
