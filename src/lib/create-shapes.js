import {createWave} from './shape-generators/create-waves';
import {createRadial} from './shape-generators/create-radial';

const shapeGenerators = {
	wave: createWave,
	radial: createRadial
};

const generateData = (complexity, hash, index) =>
	new Array(complexity)
		.fill()
		.map((o, i) => Math.abs(parseInt(hash.charAt(i + index), 16) - 3));

const generateCoord = (hash, i) => {
	const a = parseInt(hash.charAt(i), 16);
	const b = parseInt(hash.charAt(i + 4), 16);
	return (a + b) * 25;
};

export const createShapes = (
	colors,
	complexity,
	hash,
	typeMap = {radial: 0, wave: 1}
) => {
	const shapes = {radial: [], wave: []};

	Object.keys(typeMap).forEach(type => {
		for (let i = 0; i < typeMap[type]; i++) {
			let x = 0;
			let y = generateCoord(hash, i);

			const color = colors.pop();

			if (type === 'radial') {
				y = generateCoord(hash, i);
				x = generateCoord(hash, i + 1);
			}

			const coords = {x, y};

			shapes[type].push(
				shapeGenerators[type]({
					complexity,
					data: generateData(complexity, hash, i),
					color,
					coords
				})
			);
		}
	});
	return shapes;
};
