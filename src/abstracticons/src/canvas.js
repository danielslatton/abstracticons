export const createCanvas = (paths, opts = {}) => {
	const height = opts.width || 64;
	const width = opts.width || 64;
	const bgColor = opts.bgColor || 'black';
	const {shape} = opts;

	const viewbox = {
		height: 600,
		width: 600
	};

	const shapes = {
		circle: '<circle cx="300" cy="300" r="300" />',
		triangle: '<polygon points="300 0, 0 600, 600 600" />',
		octagon:
			'<polygon points="180 0, 420 0, 600 180, 600 420, 420 600, 180 600, 0 420, 0 180" />'
	};

	const clipPath = `  
    <defs>
      <clipPath id="shape">
        ${shapes[shape]}
      </clipPath>
    </defs>
  `;

	const svg = `
  <svg
    width="${width}"
    height="${height}"
    viewBox="0 0 ${viewbox.height} ${viewbox.width}"
    xmlns="http://www.w3.org/2000/svg"
  >
  ${shapes[shape] ? clipPath : ''}
    <g ${shapes[shape] ? 'clip-path=url(#shape)' : ''}>
      <rect height="100%" width="100%" fill="${bgColor}" />
      <g transform="translate(0,0)">
        ${paths}
      </g>
    </g>
  </svg>`;
	return svg;
};
