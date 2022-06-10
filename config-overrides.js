const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.s[ac]ss$/i,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          // Provide path to the file with resources
          resources: './src/assets/styles/index.scss',
        },
      },
    ],
  })
);
