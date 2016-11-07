var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: "./src/app/app.js",
    output: {
        filename: "./src/appBundler.js",
    },
    devtool: 'node',
    module: {
        loaders: [
            {
                loader: 'babel',
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|vendors)/,
                query: {
                    presets: ['react', 'es2015']
                }
            },
		   { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file' },
      	   { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      	   { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      	   { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
      	   { test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=[name].[ext]' },
      	   { test: /\.ico$/, loader: 'file?name=[name].[ext]' },
      	   { test: /\.css$/, loader: "style-loader!css-loader" },
        ]
    },
    resolve: {
        root: path.resolve('./src/app'),
        extenstions: ['', '.js']
    },
postcss: () => [autoprefixer]
}
