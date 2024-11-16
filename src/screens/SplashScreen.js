import {View, Text, Image} from 'react-native';
import React from 'react';

const SplashScreen = () => {
  return (
    <View datatestID="SplashScreen"
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Text datatestID="SplashScreenText">Splash Screen</Text>
      <Image
        style={{width: '75%'}}
        resizeMode="contain"
        source={require('../../src/assets/SSG_OWOF.png')}
      />
    </View>
  );
};

export default SplashScreen;