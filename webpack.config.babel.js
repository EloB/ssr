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
        web: [
          ...(DEVELOPMENT ? [
            'webpack-dev-server/client?http://localhost:8080/',
            'webpack/hot/only-dev-server',
          ] : []),
          join(__dirname, './src/client'),
        ],
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
      ...(target === 'node' ? [new WriteFilePlugin()] : []),
    ],
    externals: [
      ...(target === 'node' ? [nodeExternals({ whitelist: [webpackHotModule] })] : []),
    ],
    devServer: {
      inline: false,
      hotOnly: true,
      contentBase: false,
      after: (app) => {
        let once = true;
        app.use((req, res, next) => {
          if (once) {
            app.use(require('./dist/node/node').default)
            once = false;
          }
          next();
        });
      },
    },
  }));
};
