export const makePath = (d, color, transform = '') => {
	return `
      <path 
        d="${d}Z" 
        fill="${color} "
        transform="${transform}"
      ></path>
  `;
};

export const makeGroup = (coords, shapes) => {
	return `
    <g transform="translate(${coords.x},${coords.y})">
      ${shapes}
    </g>
  `;
};
