module.exports = {
    entry: './example/App.js',
    output: {
        path: './bin',
        filename: 'example.js'
    },
    node: {
        fs: "empty"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            },
            {
                test: /\.s?css$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(ttf|eot|svg|jpg|png|woff)$/,
                loader: "url-loader"
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
    }
};
