module.exports = {
  presets: [
    '@babel/preset-env', // Transpile modern JavaScript to ES5
    'module:@react-native/babel-preset' // React Native preset
  ],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    }]
  ]
};