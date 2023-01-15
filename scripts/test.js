
// create and setup on-screen canvas (camera)
// based on screen size

// create and setup offscreen canvas (renderer)
// based on render size in grid units

// get the world id from the url bar

// get the player data for the world from local storage

// get the players position

// create an empty in memory entities object and put the player in it

// set up step engine

// on each frame
// check the players location

// determine the coordinates of the rendering canvas based on the player

// based on the rendering canvas coords, check which chunks are intersecting

// for each intersecting chunk

// load tiles and characters from local storage

// add the tiles and characters from the local storage to the in memory object

// create an offscreen canvas

// render the tiles and characters for that chunk

// determine the offset from the rendering canvas

// draw the chunk canvas as as images onto the render canvas with the offsets

// remove any chunks from the list that are no longer intersecting

//
//
//
//
//

// constants

const gridSize = 64;
const renderSize = 14;
const chunkSize = 16;
const chunkDistance = gridSize * chunkSize;
const renderDistance = gridSize * renderSize;

// handle viewport size changes

const viewport = {
	width: 0,
	height: 0
};

const setWindowSize = () => {
	viewport.width = window.innerWidth;
	viewport.height = window.innerHeight;
};

setWindowSize();

window.addEventListener('resize', setWindowSize);

// creating the viewbox (camera)

const viewbox = document.createElement('canvas');

viewbox.width = viewport.width;
viewbox.height = viewport.height;

document.body.appendChild(viewbox);

const vbContext = viewbox.getContext('2d');
vbContext.imageSmoothingEnabled = false;

// creating the renderbox (perception)

const renderbox = new OffscreenCanvas(renderDistance, renderDistance);

const rbContext = renderbox.getContext('2d');
rbContext.imageSmoothingEnabled = false;

// getting the worldId from the query params

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

const worldId = params.worldId || 'test';

// get the players data from local storage

let playerData = JSON.parse(localStorage.getItem(`world#${worldId}#player`));

if (!playerData) {
	playerData = { id: 'player', type: 'character', position: { x: 800, y: 800 } };

	localStorage.setItem(`${worldId}#player`, JSON.stringify(playerData));
}

// setup an in memory entity database

const entities = {};

entities[playerData.position.x] = {};
entities[playerData.position.x][playerData.position.y] = {
	characters: [{ id: 'player' }],
	tiles: []
};

// setting up extra canvases

const cam1 = document.getElementById('cam1');
const cam2 = document.getElementById('cam2');
const cam3 = document.getElementById('cam3');
const cam4 = document.getElementById('cam4');

const context1 = cam1.getContext('2d');
const context2 = cam2.getContext('2d');
const context3 = cam3.getContext('2d');
const context4 = cam4.getContext('2d');

const contextCams = [context1, context2, context3, context4];

// rendering processor

const render = () => {
	const chunks = {};

	const { x, y } = playerData.position;

	// console.log({ x, y });

	// get all four corners of the render box and convert the coords to chunk coords.

	const renderboxLeftBoundary = x - (renderDistance / 2);
	const renderboxTopBoundary = y - (renderDistance / 2);
	const renderboxRightBoundary = x + (renderDistance / 2);
	const renderboxBottomBoundary = y + (renderDistance / 2);

	// console.log({ renderboxLeftBoundary, renderboxRightBoundary, renderboxTopBoundary, renderboxBottomBoundary });

	const renderboxTlX = Math.trunc(renderboxLeftBoundary / chunkDistance);
	const renderboxTlY = Math.trunc(renderboxTopBoundary / chunkDistance);
	chunks[`${renderboxTlX}#${renderboxTlY}`] = {};

	const renderboxBlX = Math.trunc(renderboxLeftBoundary / chunkDistance);
	const renderboxBlY = Math.trunc(renderboxBottomBoundary / chunkDistance);
	chunks[`${renderboxBlX}#${renderboxBlY}`] = {};

	const renderboxBrX = Math.trunc(renderboxRightBoundary / chunkDistance);
	const renderboxBrY = Math.trunc(renderboxBottomBoundary / chunkDistance);
	chunks[`${renderboxBrX}#${renderboxBrY}`] = {};

	const renderboxTrX = Math.trunc(renderboxRightBoundary / chunkDistance);
	const renderboxTrY = Math.trunc(renderboxTopBoundary / chunkDistance);
	chunks[`${renderboxTrX}#${renderboxTrY}`] = {};

	// deduplicates the chunk coords and load their data or generate data

	const chunkContextStack = [];

	Object.keys(chunks).forEach((chunk) => {
		const chunkX = chunk.split('#')[0];
		const chunkY = chunk.split('#')[1];
		let chunkData = JSON.parse(localStorage.getItem(`world#${worldId}#chunk#${chunk}`));
		if (!chunkData) {
			chunkData = [
				{ id: 'dirt', type: 'tile', position: { x: 1400, y: 1400 } },
				{ id: 'goblin', type: 'character', position: { x: 1500, y: 1500 } },
				{ id: 'dirt', type: 'tile', position: { x: 1600, y: 1600 } },
				{ id: 'dirt', type: 'tile', position: { x: 200, y: 200 } },
				{ id: 'dirt', type: 'tile', position: { x: 800, y: 800 } }
			];
			localStorage.setItem(`${worldId}#player`, JSON.stringify(playerData));
		}

		// console.log(chunkData);

		// TODO: set the chunk data into in-memory db

		// render the chunk into an offscreen canvas

		const chunkbox = new OffscreenCanvas(chunkDistance, chunkDistance);

		const chunkContext = chunkbox.getContext('2d');
		chunkContext.imageSmoothingEnabled = false;

		chunkContext.clearRect(0, 0, chunkbox.width, chunkbox.height);

		chunkContext.fillStyle = 'green';

		chunkContext.fillRect(0, 0, chunkSize, chunkSize);

		chunkData.forEach((entity) => {
			const { x, y } = entity.position;
			const offsetX = x - (chunkX * chunkDistance);
			const offsetY = y - (chunkY * chunkDistance);

			// console.log({ offsetX, offsetY });
			chunkContext.fillRect(offsetX, offsetY, gridSize, gridSize);
		});

		chunkContextStack.push({
			x: chunkX * chunkDistance,
			y: chunkY * chunkDistance,
			canvas: chunkbox
		});
	});

	// console.log(chunkContextStack);

	chunkContextStack.forEach((stack, index) => {
		// console.log(renderboxLeftBoundary, renderboxTopBoundary);
		// console.log({ stack });
		// console.log('\n');
		contextCams[index + 1].drawImage(stack.canvas, 0, 0, chunkDistance, chunkDistance);
		rbContext.drawImage(stack.canvas, stack.x - renderboxLeftBoundary, stack.y - renderboxTopBoundary, chunkDistance, chunkDistance);
	});

	const vbStartX = renderbox.width / 2 - vbContext.width / 2;
	const vbStartY = renderbox.height / 2 - vbContext.height / 2;

	vbContext.clearRect(0, 0, viewbox.width, viewbox.height);
	vbContext.drawImage(renderbox, vbStartX, vbStartY, viewbox.width, viewbox.height, 0, 0, viewbox.width, viewbox.height);
};

// creating a stepper function

let start;

const fps = 120;
const fpsInterval = 1000 / fps;

let lastFrameTimestamp;

const step = (timestamp) => {
	if (!start) start = timestamp;
	if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;

	if (timestamp > lastFrameTimestamp + fpsInterval) {
		lastFrameTimestamp = timestamp;
		render();
	}

	if(window.pause) return;
	window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);
