import React from 'react';
import { View, StyleSheet } from 'react-native';

const Player = ({ position }) => {
    return (
        <View
            style={[
                styles.player,
                {
                    left: position.x,
                    top: position.y, // Use top instead of bottom
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    player: {
        width: 50,
        height: 50,
        backgroundColor: '#4169e1',
        position: 'absolute',
        borderRadius: 15,
    },
});

export default Player;