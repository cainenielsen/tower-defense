// Example chunkIds
// 0#0
// 15#4

// maybe we could use something like this to translate raw pixel dimensions to chunk coordinates?
// const translateChunkCoords = () => {};

const getChunkId = (x, y) => `${x}#${y}`;

const getChunk = ({ x, y }) => {
	const chunkId = getChunkId(x, y);
	const chunkString = localStorage.getItem(chunkId);
	return JSON.parse(chunkString);
};

const setChunk = ({ x, y }, delta) => {
	const chunkId = getChunkId(x, y);
	const chunkData = getChunk(chunkId);
	const newChunkData = { ...chunkData, ...delta };
	localStorage.setItem(chunkId, JSON.stringify(newChunkData));
};

export {
	getChunk,
	setChunk
};
