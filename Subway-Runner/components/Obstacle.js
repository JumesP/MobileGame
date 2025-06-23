import React from 'react';
import { View } from 'react-native';

const Obstacle = ({ position, size, color, borderRadius }) => {
    return (
        <View
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                backgroundColor: color || 'red',
                borderRadius: borderRadius || 5,
                borderWidth: 2,
                borderColor: 'black',
            }}
        />
    );
};

export default Obstacle;