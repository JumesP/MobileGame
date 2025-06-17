import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameObject, GameObjectComponent } from './GameObject';

class Snowball extends GameObject {
    constructor(position = { x: 0, y: 0 }, size = 50) {
        // Call parent constructor with position and size
        super(position, size);
    }

    // Override getBounds to handle the bottom-based Y coordinate system used by Snowball
    getBounds() {
        const { height } = Dimensions.get('window');
        return {
            left: this.position.x,
            right: this.position.x + this.size.width,
            // Convert from bottom-based coordinates to top-based for collision detection
            top: height - this.position.y - this.size.height,
            bottom: height - this.position.y
        };
    }

    // Jump function (specific to Snowball)
    jump(height) {
        this.speed.y = height || 15;
        return this.position;
    }
}

// React component that renders a snowball instance
const SnowballComponent = ({ position, size = 50, style }) => {
    return (
        <GameObjectComponent
            position={position}
            size={size}
            backgroundColor="blue"
            borderRadius={size / 2} // Make it circular
            hitboxColor="red"
            style={style}
        />
    );
};

export { Snowball, SnowballComponent };
export default SnowballComponent;
