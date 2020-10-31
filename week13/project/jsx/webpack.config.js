const path = require('path');
const rules = [
	{
		test: /\.js$/,
		use: {
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env'],
				plugins: [
					/* customize the React.createElement to createElement */
					[
						'@babel/plugin-transform-react-jsx',
						{ pragma: 'Framework.createElement' }
					]
				]
			}
		}
	}
];

const devServer = {
	contentBase: path.join(__dirname, 'dist'),
	compress: true,
	port: 9000
};

const mode = 'development';

const config = {
	entry: './main.js',
	module: {
		rules: rules
	},
	mode,
	devServer
};

module.exports = config;
