import { HotModuleReplacementPlugin, NamedModulesPlugin } from 'webpack';
import { join, relative } from 'path';
import nodeExternals from 'webpack-node-externals';
import WriteFilePlugin from 'write-file-webpack-plugin';

const poll = 'webpack/hot/poll?1000';

export default (env, argv) => {
  const DEVELOPMENT = argv.mode === 'development';

  return ['web', 'node'].map(target => ({
    target,
    mode: argv.mode,
    entry: {
      node: [
        ...(DEVELOPMENT ? [poll] : []),
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
    output: {
      path: join(__dirname, 'dist', target),
      filename: '[name].js',
      publicPath: '/',
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
      ...(target === 'node' ? [nodeExternals({ whitelist: [poll] })] : []),
    ],
    devServer: {
      proxy: { '*': 'http://localhost:3000' },
      inline: false,
      hotOnly: true,
    },
  }));
};
