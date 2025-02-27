module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins:[
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@context': './src/context',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@assets': './src/assets',
        },
      },
      'react-native-reanimated/plugin',
    ]
  ]
};
