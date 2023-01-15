// Example chunkIds
// 0#0
// 15#4

// maybe we could use something like this to translate raw pixel dimensions to chunk coordinates?
// const translateChunkCoords = () => {};

const getChunkId = (worldId, x, y) => `${worldId}#${x}#${y}`;

const getChunkData = (worldId, { x, y }) => {
	const chunkId = getChunkId(worldId, x, y);
	const chunkString = localStorage.getItem(chunkId);
	return JSON.parse(chunkString);
};

const setChunkData = (worldId, { x, y }, delta) => {
	const chunkId = getChunkId(worldId, x, y);
	const chunkData = getChunkData(chunkId, { x, y }) || {};
	const newChunkData = { ...chunkData, ...delta };
	localStorage.setItem(chunkId, JSON.stringify(newChunkData));
};

const getPlayerData = (worldId) => {
	const chunkString = localStorage.getItem(`${worldId}#player`);
	return JSON.parse(chunkString);
};

const setPlayerData = (worldId, delta) => {
	const playerData = getPlayerData(worldId) || {};
	const newPlayerData = { ...playerData, ...delta };
	localStorage.setItem(`${worldId}#player`, JSON.stringify(newPlayerData));
};

const getWorldListData = () => {
	const worldListString = localStorage.getItem('worlds');
	return JSON.parse(worldListString);
};

const setWorldListData = (item) => {
	const worldListData = getWorldListData() || [];
	const newWorldListData = [ ...worldListData, item ];
	localStorage.setItem('worlds', JSON.stringify(newWorldListData));
};

export {
	getChunkData,
	setChunkData,
	getPlayerData,
	setPlayerData,
	getWorldListData,
	setWorldListData
};
