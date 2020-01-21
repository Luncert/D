const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let common_config = {
    mode: process.env.ENV || 'development',
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [
                    /node_modules/
                ]
            },
            {
                test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
                resolve: {
                  aliasFields: ['main']
                }
            },
            {
                test: /\.css$/,
                oneOf: [{
                    resourceQuery: /^\?global$/,
                    use: [{
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                    ]
                }, {
                    use: [{
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: true,
                                modules: {
                                    localIdentName: "[name]_[local]_[hash:base64:5]",
                                },
                            }
                        }
                    ]
                }]
            },
            {
                test: /\.(png|ttf|otf|eot|woff|woff2|svg)$/,
                loader: 'file-loader'
            },
            {
                test: /\.node$/,
                loader: 'node-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css']
    },
};

let main_config = Object.assign({}, common_config, {
    node: {
        __dirname: false
    },
    target: 'electron-main',
    entry: {
        main: './src/main/index.ts',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
});

let renderer_config = Object.assign({}, common_config, {
    node: {
        __dirname: true
    },
    target: 'electron-renderer',
    entry: {
        renderer: './src/renderer/index.tsx',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: './public',
            to: path.resolve(__dirname, 'build')
        }])
    ]
});

module.exports = [
    main_config,
    renderer_config
];