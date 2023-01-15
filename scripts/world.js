import Room from './room.js';

export default class World {
	constructor(worldId) {
		this.id = worldId;
		this.rooms = {};
		this.createRoom('overworld');
	}
	createRoom(roomName) {
		this.rooms[roomName] = new Room({ height: 2, width: 2 });
	}
	getRoom(roomName) {
		return this.rooms[roomName];
	}
}
