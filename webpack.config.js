const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const defaultConfig = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },{
                test: /\.json$/,
                use: 'json-loader',
                exclude: /node_modules/
            }
        ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
        minimizer: [new TerserPlugin()]
    }
}

module.exports = [{
        ...defaultConfig,
        entry: {
            client: './src/client/index.ts'
        },
        output: {
            filename: 'client.js',
            path: path.resolve(__dirname, 'static')
        }
    },{
        ...defaultConfig,
        entry: {
            server: './src/server/index.ts'
        },
        target: 'node',
        output: {
            filename: 'server.js',
            path: path.resolve(__dirname, 'dist')
        },
        node: {
            fs: 'empty',
            net: 'empty'
        }
}]