var path = require('path');

module.exports = {
    entry: {
        'sh-rich-text-editor': './src/sh-rich-text-editor.js',
    },
    output: {
        path: './bin',
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
    },
    externals: [
        {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
            },
        },
        {
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
            },
        },
        {
            lodash: {
                root: '_',
                commonjs2: 'lodash',
                commonjs: 'lodash',
                amd: 'lodash',
            },
        },
    ],
    module: {
        noParse: /node_modules\/quill\/dist/,
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.html|\.woff|\.ttf|\.eot$/,
                loader: "file-loader?name=[name].[ext]",
            },
            {
                test: /\.s?css$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
        ],
    }
};
