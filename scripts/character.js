import Entity from './entity.js';

export default class Character extends Entity {
	constructor(position, dimensions, velocityXMax = 16, velocityYMax = 16) {
		super(position, dimensions);
		this.velocity = {
			x: {
				current: 0,
				max: velocityXMax
			},
			y: {
				current: 0,
				max: velocityYMax
			}
		},
		this.jumpHeight = 8,
		this.acceleration = 0.5;
		this.controls = {
			walking: {
				direction: undefined
			}
		};
	}
}
