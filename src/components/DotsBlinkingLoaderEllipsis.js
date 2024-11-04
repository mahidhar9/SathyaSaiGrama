import { View, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

export default function DotsBlinkingLoaderEllipsis() {
    const count = 5;
    const scales = Array.from({ length: count }, () => useRef(new Animated.Value(0.1)).current);
    const colors = Array.from({ length: count }, () => useRef(new Animated.Value(0)).current);
    useEffect(() => {
        const startAnimation = (index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scales[index], {
                        toValue: 0.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scales[index], {
                        toValue: 0.1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(colors[index], {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true, 
                    }),
                    Animated.timing(colors[index], {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        scales.forEach((_, index) => {
            const timeout = setTimeout(() => {
                startAnimation(index);
            }, index * 400);
            return () => clearTimeout(timeout);
        });
    }, [scales]);

    const interpolateColor = (index) => {
        const startColor = index < 3 ? '#B21E2B' : '#FF5733'; 
        const endColor = index < 3 ? '#B21E2B' : '#FF5733'; 

        return colors[index].interpolate({
            inputRange: [0, 1],
            outputRange: [startColor, endColor],
        });
    };

    return (
        <View style={styles.container}>
            {scales.map((scale, index) => (
                <Animated.View 
                    key={index}
                    style={[
                        styles.circle,
                        {
                            transform: [{ scale }],
                            backgroundColor: interpolateColor(index),
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: -20,
    },
});
