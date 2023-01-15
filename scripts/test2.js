// handle viewport size changes

const viewport = {
	width: 0,
	height: 0
};

const setWindowSize = () => {
	viewport.width = window.innerWidth;
	viewport.height = window.innerHeight;
	console.log(viewport);
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

const renderbox = new OffscreenCanvas(512, 512);

const rbContext = renderbox.getContext('2d');
rbContext.imageSmoothingEnabled = false;

// example data

rbContext.fillStyle = 'green';
rbContext.fillRect(0, 0, 512, 512);
rbContext.fillStyle = 'red';
rbContext.font = '10px Arial';
rbContext.fillText('demo', 0, 10);

const chunkData = {
	contents: [
		{},{},{},{}
	]
};

const chunks = {
	'0#0': [],
	'-0#0': [],
	'0-0': [],
	'-0#-0': []
};

const player = {
	position: {
		x: 0,
		y: 0
	}
};

const chunkbox = new OffscreenCanvas(1024, 1024);

const chunkContext = chunkbox.getContext('2d');
chunkContext.imageSmoothingEnabled = false;

chunkContext.fillStyle = 'silver';
chunkContext.fillRect(0, 0, 1024, 1024);

chunkContext.fillStyle = 'orange';
chunkContext.fillRect(0, 0, 512, 512);

chunkContext.fillStyle = 'pink';
chunkContext.fillRect(512, 0, 512, 512);

chunkContext.fillStyle = 'lime';
chunkContext.fillRect(0, 512, 512, 512);

chunkContext.fillStyle = 'teal';
chunkContext.fillRect(512, 512, 512, 512);

chunkContext.fillStyle = 'brown';
chunkContext.fillRect(256, 256, 512, 512);

chunkContext.fillStyle = 'red';
chunkContext.font = '10px Arial';
chunkContext.fillText('demo', 0, 10);



// rendering

const render = () => {
	rbContext.drawImage(chunkbox, 0, 0, chunkbox.width, chunkbox.height, 0, 0, chunkbox.width, chunkbox.height);

	const vbrbOffsetX = renderbox.width / 2 - viewbox.width / 2;
	const vbrbOffsetY = renderbox.height / 2 - viewbox.height / 2;
	vbContext.drawImage(renderbox, vbrbOffsetX, vbrbOffsetY, viewbox.width, viewbox.height, 0, 0, viewbox.width, viewbox.height);
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

	if (window.pause) return;
	window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);
