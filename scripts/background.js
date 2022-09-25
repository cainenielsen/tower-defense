const img = new Image();
img.src = 'resources/bg.png';

class Background {
	constructor(game) {
		this.width = game.dimensions.width;
		this.height = game.dimensions.height;
	}
	draw(context) {
		// const gradient = context.createLinearGradient(0, 0, this.width, this.height);
		// gradient.addColorStop(0, 'rgb(140, 140, 255)');
		// gradient.addColorStop(1, 'white');

		// context.fillStyle = gradient;
		// context.fillRect(0, 0, this.width, this.height);

		context.drawImage(img, 0, 0, this.width, this.height);
	}
	animate() {

	}
}

export default Background;
