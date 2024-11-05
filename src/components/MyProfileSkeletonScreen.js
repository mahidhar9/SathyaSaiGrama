import {FlatList, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const getRandomDuration = () => Math.floor(Math.random() * 1000) + 1000;

export default function SkeletonLoader() {
  const renderFirstList = () =>
    [1].map((item, index) => (
      <View
        key={index}
        style={{
          alignItems: 'center',
          marginVertical: 10,
          backgroundColor: '#fff',
          width: '90%',
          alignSelf: 'center',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <ShimmerPlaceholder
          style={{
            width: '100%',
            height: 158,
            borderBottomColor: '#9e9e9e',
            borderBottomWidth: 1,
            borderRadius: 10,
            opacity: 0.2,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
          duration={getRandomDuration()}
        />
      </View>
    ));

  const renderSecondPlaceholder = () => (
    <View
      style={{
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: '#fff',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}>
      <ShimmerPlaceholder
        style={{
          width: '100%',
          height: 100,
          borderRadius: 10,
          justifyContent: 'center',
          opacity: 0.2,
        }}
        duration={getRandomDuration()}
      />
    </View>
  );

  return (
    <FlatList
      data={[1]}
      ListHeaderComponent={() => (
        <>
          {renderFirstList()}
          {renderSecondPlaceholder()}
        </>
      )}
      style={{width: '100%'}}
      renderItem={() => (
        <View
          style={{
            alignItems: 'center',
            marginVertical: 10,
            backgroundColor: '#fff',
            width: '90%',
            alignSelf: 'center',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <ShimmerPlaceholder
            style={{
              width: '100%',
              height: 75,
              borderRadius: 20,
              justifyContent: 'center',
              opacity: 0.2,
            }}
            duration={getRandomDuration()}
          />
        </View>
      )}
    />
  );
}
