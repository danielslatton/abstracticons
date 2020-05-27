import {lineRadial, curveBasisClosed, curveCardinalClosed} from 'd3-shape';
import {makePath, makeGroup} from '../svg';

const curves = [curveBasisClosed, curveCardinalClosed];

export function roundPath(path, precision = 0.1) {
	if (!path) {
		return;
	}

	const query = /[\d.-][\d.e-]*/g;
	return path.replace(
		query,
		n => Math.round(n * (1 / precision)) / (1 / precision)
	);
}

export const createRadial = (opts = {}) => {
	const minRadius = 250;
	const complexity = opts.complexity || new Error('complexity is required');
	const data = opts.data || new Error('data is required');
	const color = opts.color || 'black';
	const coords = opts.coords || {x: 300, y: 300};
	const radialData = data.map(point => ({
		radius: minRadius + Math.floor((point / 10) * (300 - minRadius))
	}));

	const fullCircle = 2 * Math.PI;

	const d = roundPath(
		lineRadial()
			.radius(d => d.radius)
			.angle((d, i) => (fullCircle / complexity) * i)
			.curve(curves[data[0] % 2])(radialData)
	);

	return makeGroup(coords, makePath(d, color));
};
