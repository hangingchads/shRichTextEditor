module.exports = {
    entry: './example/App.js',
    output: {
        path: './bin',
        filename: 'example.js',
    },
    module: {
        noParse: /node_modules\/quill\/dist/,
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
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.(ttf|eot|svg|jpg|png|woff)$/,
                loader: "url-loader"
            },
        ],
    }
};
