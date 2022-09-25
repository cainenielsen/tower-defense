import { Position, Plane } from './resources.js';

export default class Entity {
	constructor(position = { x: 0, y: 0 }, dimensions = { width: 16, height: 16 }) {
		const { x, y } = position;
		const { width, height } = dimensions;
		this.position = new Position(x, y);
		this.dimensions = new Plane(width, height);
	}
	get boundingLeft() {
		return this.position.x;
	}
	get boundingRight() {
		return this.position.x + this.dimensions.width;
	}
	get boundingTop() {
		return this.position.y;
	}
	get boundingBottom() {
		return this.position.y + this.dimensions.height;
	}
	get centerPosition() {
		return new Position(
			this.position.x + this.dimensions.width / 2,
			this.position.y + this.dimensions.height / 2
		);
	}
}
