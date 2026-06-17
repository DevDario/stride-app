module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        { jsxImportSource: 'nativewind', unstable_transformImportMeta: true },
      ],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './src/components',
            '@screens': './src/features',
            '@hooks': './src/hooks',
            '@widgets': './src/widgets',
            '@store': './src/store',
            '@utils': './src/utils',
            '@api': './src/services/api',
            '@assets': './src/assets',
            '@illustrations': './src/assets/illustrations',
          },
        },
      ],
    ],
  };
};
