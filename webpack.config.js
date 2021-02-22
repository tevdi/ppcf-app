var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
	/* In case of required dynamic basename for development in local: 

		npm run local -- --directory='/dynamic/directory/'
		
	*/
	let basename
	// const API_REST_URL = 'https://stake-something-staging.herokuapp.com'						  // No need to use API Rest folder if there isn't.
    const API_REST_SOURCE = 'http://localhost:8000'				                                  // No need to use API Rest folder if there isn't.
    const API_REST_URL = 'http://localhost:3000';
	if (argv.domain){
		if (argv.directory){
			basename = argv.directory
		} else {
			// basename = __dirname.substring(__dirname.lastIndexOf("/")+1);
			// basename = '/'+basename+'/dist/';
			basename = __dirname.replace('/var/www', '') + '/dist'																					// The root of Apache must be /var/www
		}
	} else {
		basename = ''
	}

	console.log('Environment: '+ env)
	console.log('BASENAME is: ' + basename)
	console.log('API REST URL is: ' + API_REST_URL)
return({
    output: {
			path: path.resolve(__dirname, 'dist'),
			publicPath: `${basename}/`,
			filename: '[hash].js',
    },
    module: {
        rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
            loader: "babel-loader"
            }
        },
        {
            test: /\.html$/,
            use: [
            {
                loader: "html-loader"
            }
            ]
        },
        {
            test: /\.css$/,
            use: [
            'style-loader',
            'css-loader'
            ]
        },
        {
            test: /\.s(a|c)ss$/,
            exclude: /\.module.(s(a|c)ss)$/,
            loader: [MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
            },
            {
                loader: 'sass-loader',
            }
            ]
        }        
        ]
    },
    plugins: [
        ...(argv.mode == 'production' ? [new CleanWebpackPlugin()] : []),
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new BaseHrefWebpackPlugin({ baseHref: basename }),
        new webpack.DefinePlugin({
        process: {
            env: {
              BASENAME: JSON.stringify(basename),
              API_REST_URL: JSON.stringify(API_REST_URL)
            }
        }
        }),
        new CopyPlugin([
        {
            from: 'src/*.json',
            flatten: true,
        },
        {
            from: 'src/*.ico',
            flatten: true,              
        },
        ]),
        new MiniCssExtractPlugin({
            filename: '[hash].css',
            chunkFilename: '[hash].css'
        }),
    ],
    devServer: {
			host: 'localhost',
			port: 3000,
			historyApiFallback: true,
			proxy: {
				'/rest/**': {
					target: API_REST_SOURCE,
				}
			},
		}		
	})
}
