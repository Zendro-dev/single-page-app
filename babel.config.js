const presets = [
  ['next/babel'],
  [
    '@babel/preset-env',
    {
      targets: {
        esmodules: true,
      },
    },
  ],
];
const plugins = ['istanbul'];

module.exports = { presets, plugins };
