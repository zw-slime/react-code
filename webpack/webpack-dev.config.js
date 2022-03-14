const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports  = {
    entry: './src/index.jsx',
    output: {
        filename: "index.js",
        path: path.resolve(__dirname,'../dist')
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        filename:'index.html',
        template:'index.html',
    })],
    devServer: {
        static: './dist'
    },

}
