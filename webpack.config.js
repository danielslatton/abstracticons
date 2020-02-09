const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/public/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{loader: 'css-loader', options: {importLoaders: 1}},
					'postcss-loader'
				]
			}
		]
	},
	plugins: []
};
