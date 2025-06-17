import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { GameObject, GameObjectComponent } from './GameObject';

// Obstacle types with their properties
const OBSTACLE_TYPES = {
    CAR: {
        id: 'CAR',
        width: 50,
        height: 80,
        color: '#ff6347', // Tomato red
        borderRadius: 5,
        points: 15,
        speed: 1.2, // Speed multiplier
    },
    PERSON: {
        id: 'PERSON',
        width: 30,
        height: 45,
        color: '#4169e1', // Royal blue
        borderRadius: 15,
        points: 10,
        speed: 0.9, // Slower than default
    },
    BUILDING: {
        id: 'BUILDING',
        width: 70,
        height: 100,
        color: '#808080', // Gray
        borderRadius: 2,
        points: 25,
        speed: 0.7, // Slower than others
    },
    DEFAULT: {
        id: 'DEFAULT',
        width: 50,
        height: 50,
        color: 'red',
        borderRadius: 5,
        points: 5,
        speed: 1.0,
    }
};

class Obstacle extends GameObject {
    constructor(type = 'DEFAULT', position = { x: 0, y: 0 }, baseSpeed = 5) {
        // Get obstacle type properties (or use DEFAULT if not found)
        const obstacleType = OBSTACLE_TYPES[type] || OBSTACLE_TYPES.DEFAULT;
        const size = {
            width: obstacleType.width,
            height: obstacleType.height,
        };

        // Call parent constructor with position and size
        super(position, size);

        // Obstacle-specific properties
        this.type = type;
        this.color = obstacleType.color;
        this.borderRadius = obstacleType.borderRadius;
        this.points = obstacleType.points;

        // Set the vertical speed (obstacles typically move down the screen)
        this.speed.y = baseSpeed * obstacleType.speed;
    }

    // Override updatePosition to focus on vertical movement (specialized for obstacles)
    updatePosition(deltaY) {
        this.position = {
            ...this.position,
            y: this.position.y + (deltaY || this.speed.y)
        };
        return this.position;
    }

    // Get React component for rendering
    getComponent() {
        return (props) => (
            <ObstacleComponent
                position={this.position}
                size={this.size}
                color={this.color}
                borderRadius={this.borderRadius}
                type={this.type}
                {...props}
            />
        );
    }
}

// React component that renders an obstacle instance
const ObstacleComponent = ({ position, size, color, borderRadius, type, style }) => {
    return (
        <GameObjectComponent
            position={position}
            size={size}
            backgroundColor={color}
            borderRadius={borderRadius}
            hitboxColor="yellow"
            style={style}
        />
    );
};

const styles = StyleSheet.create({
    obstacleImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    }
});

// Export both the class and the obstacle types
export { Obstacle, OBSTACLE_TYPES, ObstacleComponent };
export default ObstacleComponent;
