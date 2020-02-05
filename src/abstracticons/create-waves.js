import {scaleLinear} from 'd3-scale';
import {area, curveBasis} from 'd3-shape';

import {makePath, makeGroup} from './src/svg';

export const createWave = (opts = {}) => {
	const {complexity} = opts;
	const {data} = opts;
	const width = opts.width || 600;
	const height = opts.height || 150;
	const color = opts.color || 'black';
	const {coords} = opts;

	const scaleX = scaleLinear()
		.domain([0, complexity - 10])
		.range([0, width]);

	const scaleY = scaleLinear()
		.domain([0, complexity])
		.range([0, height]);

	const d = area()
		.x((d, i) => {
			return scaleX(i);
		})
		.y1(d => {
			return scaleY(d);
		})
		.curve(curveBasis)
		.y0(height)(data);

	const roundedD = d
		.split(/M|Z/)
		.filter(d => d)[0]
		.split(',')
		.map(d => {
			if (d.includes('C')) {
				return d
					.split('C')
					.map(n => Math.round(n * 10) / 10)
					.join('C');
			}

			if (d.includes('L')) {
				return d
					.split('L')
					.map(n => Math.round(n * 10) / 10)
					.join('L');
			}

			return Math.round(d);
		});

	const def = `M${roundedD.join(',')}Z`;
	return makeGroup(coords, [
		makePath(def, color),
		makePath(def, color, 'scale(1,-1)translate(0,-290)')
	]);
};
