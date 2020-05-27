import {COLORS} from './constants';
import {createShapes} from './create-shapes';
import {createCanvas} from './canvas';

const generatePalettefromHash = (hash, colors, count) => {
	const palette = [];

	for (let i = 0; i < count; i++) {
		const index = parseInt(hash.charAt(i), 16) * 2;
		palette.push(colors[index]);
	}

	return palette;
};

export const abstracticon = (hash, opts = {}) => {
	if (typeof hash !== 'string' || hash.length < 35) {
		throw new Error('hash must be least 35 characters');
	}

	const complexityBounds = {
		min: 20,
		max: 35
	};

	const complexity = Math.min(
		parseInt(hash.charAt(0), 16) + complexityBounds.min,
		complexityBounds.max
	);
	const colors = opts.palette || generatePalettefromHash(hash, COLORS, 7);
	const {shape} = opts;
	const bgColor = colors.pop();
	const shapes = createShapes(colors, complexity, hash, {radial: 4, wave: 1});
	const radialIndex = shapes.radial.length - 1;

	const layers = {
		one: shapes.radial.slice(radialIndex),
		two: shapes.wave,
		three: shapes.radial.slice(0, radialIndex)
	};

	const paths = layers.three.concat(layers.two.concat(layers.one));
	return createCanvas(paths, {
		width: 400,
		bgColor,
		shape
	});
};
