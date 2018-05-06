const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
   
module.exports = {
	entry: {
		main: 'src/Bootstrap.js',
	},
	output: {
		publicPath: '',
		// filename: 'Bootstrap.[hash:5].js',
		filename: 'Bootstrap.js',
		path: path.resolve(__dirname, 'build'),
	},  
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: [path.resolve(__dirname, 'node_modules')],
				loader: 'babel-loader',
				options: {
					presets: ['stage-3','es2015']
				}
			}
		],
	},
	node: {
		fs: 'empty'
	},
	resolve: {
		modules: [
			__dirname,
			'node_modules',
		],
	},
	plugins: [
        CopyWebpackPlugin([
            {from: path.resolve(__dirname, 'src/index.html')},
        ]),
		new CleanWebpackPlugin(['build'])
	],
	devtool: 'source-map',
	externals: [
	]
};
