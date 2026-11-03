import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type Props = {
    emoji: string;
    bounceKey: number;
};

export function PetView({ emoji, bounceKey}: Props) {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scale, { toValue: 1.3, speed: 40, useNativeDriver: true}),
            Animated.spring(scale, {toValue: 1, friction: 3, useNativeDriver: true}),
        ]).start();
    }, [bounceKey, scale]);

    return (
        <View style={styles.wrap}>
            <Animated.Text style={[styles.emoji, {transform: [{ scale }] }]}>
                {emoji}
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emoji: { fontSize: 96},
});