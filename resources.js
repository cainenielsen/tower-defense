export class Key {
	constructor(code, state = 'up') {
		this.code = code;
		this.state = state;
	}
}

export class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class Plane {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
}
