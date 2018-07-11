import { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack';
import { join, relative } from 'path';
import nodeExternals from 'webpack-node-externals';
import WriteFilePlugin from 'write-file-webpack-plugin';

const webpackHotModule = 'webpack/hot/poll?1000';

export default (env, argv) => {
  const DEVELOPMENT = argv.mode === 'development';

  return ['web', 'node'].map(target => ({
    target,
    mode: argv.mode,
    entry: {
      [target]: {
        node: [
          ...(DEVELOPMENT ? [webpackHotModule] : []),
          join(__dirname, './src/server/index'),
        ],
        web: join(__dirname, './src/client'),
      }[target],
    },
    output: {
      path: join(__dirname, 'dist', target),
      filename: '[name].js',
      publicPath: '/',
      libraryTarget: target === 'node' ? 'commonjs' : 'var',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [
      ...(DEVELOPMENT ? [
        new NamedModulesPlugin(),
        new HotModuleReplacementPlugin(),
      ] : []),
      // If target node then write to disk
      ...(target === 'node' ? [new WriteFilePlugin()] : []),
    ],
    externals: [
      ...(target === 'node' ? [nodeExternals({ whitelist: [webpackHotModule] })] : []),
    ],
    devServer: {
      contentBase: false,
      hot: true,
      after: (app) => {
        let once = true;
        app.use((req, res, next) => {
          if (once) {
            // Wait until first build and then use ssr middleware
            app.use(require('./dist/node/node').default)
            once = false;
          }
          next();
        });
      },
    },
  }));
};
