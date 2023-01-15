import Entity from './entity.js';

export default class Tile extends Entity {
	constructor(position) {
		super(position, { width: 64, height: 64 });
	}
}

const dirtImage = new Image();
dirtImage.src = 'resources/dirt.png';

export class Dirt extends Tile {
	constructor(position) {
		super(position);
		this.sprite = dirtImage;
	}
	draw(context) {
		context.drawImage(this.sprite, this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	}
	animate() {

	}
}
