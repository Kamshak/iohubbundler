const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');


const path = require('path')

const root = p => path.resolve(__dirname, p)

module.exports = (env, argv) => {
  const mode = argv.mode;
  return {
    entry: './src/index.js',
    output: {
      path: root('dist'),
      filename: mode === 'production' ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
    },
    devServer: {
      contentBase: root('dist'),
      publicPath: '/'
    },
    devtool: mode === 'production' ? 'none' : 'cheap-module-eval-source-map',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    module: {
      rules: [{
        test: /\.(sa|sc|c)ss$/,
        use: [
          mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                require('autoprefixer')({ browsers: ['last 3 versions', 'iOS 9'] }),
              ]
            }
          },
          'sass-loader',
        ],
      }],
    },
    plugins: [
      new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
      new MiniCssExtractPlugin({
        filename: mode === 'production' ? '[name].[chunkhash].css' : '[name].css',
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: root('dist/index.html'),
        minify: {
          preserveLineBreaks: false,
          collapseBooleanAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          collapseWhitespace: true
        }
      }),
      new ResourceHintWebpackPlugin(),
    ]
  }
}