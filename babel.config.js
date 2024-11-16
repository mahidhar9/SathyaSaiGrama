module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    // '@babel/preset-env', // For general JavaScript
    // '@babel/preset-react', // If you are using React
  ],
  plugins: ["@babel/plugin-transform-private-methods"],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],

    
  
};


