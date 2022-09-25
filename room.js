import Entity from './entity.js';

const gridSizeUnit = 64;
const chunkSizeUnit = 16;

export default class Room extends Entity {
	constructor(dimensions = { width: 1, height: 1 }) {
		const { width, height } = dimensions;
		const roomWidth = gridSizeUnit * chunkSizeUnit * width;
		const roomHeight = gridSizeUnit * chunkSizeUnit * height;
		super({ x: 0, y: 0 }, { width: roomWidth, height: roomHeight });
		this.canvas = new OffscreenCanvas(roomWidth, roomHeight);

		this.context = this.canvas.getContext('2d');
		this.context.imageSmoothingEnabled = false;

		this.gravity = 1;
	}
}
