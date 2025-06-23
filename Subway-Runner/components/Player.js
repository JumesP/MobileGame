import React from 'react';
import { View, StyleSheet } from 'react-native';

const Player = ({ position }) => {
    return (
        <View
            style={[
                styles.player,
                {
                    left: position.x,
                    bottom: position.y,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    player: {
        width: 50,
        height: 50,
        backgroundColor: '#4169e1', // Royal blue color matching Player class
        position: 'absolute',
        borderRadius: 15, // Matching the Player class borderRadius
    },
});

export default Player;