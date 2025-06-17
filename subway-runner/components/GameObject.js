// filepath: /Users/jamesprice/Developer/GitHub Repos/MobileGame/subway-runner/components/GameObject.js
import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

/**
 * Base GameObject class for game elements that have position and collision capabilities
 * This serves as a parent class for elements like Snowball and Obstacle
 */
class GameObject {
    constructor(position = { x: 0, y: 0 }, size = { width: 50, height: 50 }) {
        this.id = Date.now() + Math.random().toString(); // Unique ID
        this.position = position;

        // Handle both number (for circular objects) and object size formats
        if (typeof size === 'number') {
            this.size = { width: size, height: size };
        } else {
            this.size = size;
        }

        // Default properties that child classes might override
        this.speed = {
            x: 0,
            y: 0
        };
        this.acceleration = {
            x: 0,
            y: 0
        };
    }

    // Update position with new coordinates
    updatePosition(newPosition) {
        if (newPosition) {
            this.position = { ...newPosition };
        }
        return this.position;
    }

    // Move left by a specified amount
    moveLeft(amount) {
        this.position.x -= amount || 10;
        return this.position;
    }

    // Move right by a specified amount
    moveRight(amount) {
        this.position.x += amount || 10;
        return this.position;
    }

    // Apply physics with delta time
    applyPhysics(deltaTime = 0.016) {  // default to 60fps (1/60 = ~0.016)
        // Update speed based on acceleration
        this.speed.x += this.acceleration.x * deltaTime;
        this.speed.y += this.acceleration.y * deltaTime;

        // Update position based on speed
        this.position.x += this.speed.x * deltaTime;
        this.position.y += this.speed.y * deltaTime;

        return this.position;
    }

    // Get bounds for collision detection
    // By default, uses top-left based coordinates (common in many UI systems)
    getBounds() {
        return {
            left: this.position.x,
            right: this.position.x + this.size.width,
            top: this.position.y,
            bottom: this.position.y + this.size.height
        };
    }

    // Basic collision detection between two game objects
    checkCollision(otherObject) {
        const myBounds = this.getBounds();
        const otherBounds = otherObject.getBounds();

        const isColliding = !(
            myBounds.left > otherBounds.right ||
            myBounds.right < otherBounds.left ||
            myBounds.top > otherBounds.bottom ||
            myBounds.bottom < otherBounds.top
        );

        return isColliding;
    }
}

// Base component for rendering a game object
const GameObjectComponent = ({
    position,
    size,
    backgroundColor = 'gray',
    borderRadius = 0,
    showHitbox = true,
    hitboxColor = 'red',
    showCoordinates = true,
    style
}) => {
    // Handle both number and object size
    const objSize = typeof size === 'number'
        ? { width: size, height: size }
        : size;

    return (
        <View>
            {/* Visual representation */}
            <View
                style={[
                    styles.gameObject,
                    {
                        left: position.x,
                        top: position.y,
                        width: objSize.width,
                        height: objSize.height,
                        backgroundColor,
                        borderRadius,
                    },
                    style,
                ]}
            >
                {/* Display X and Y coordinates on the object */}
                {showCoordinates && (
                    <View style={styles.coordinatesContainer}>
                        <Text style={styles.coordinateText}>
                            x: {Math.round(position.x)}
                        </Text>
                        <Text style={styles.coordinateText}>
                            y: {Math.round(position.y)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Hitbox visualization */}
            {showHitbox && (
                <View
                    style={[
                        styles.hitbox,
                        {
                            left: position.x,
                            top: position.y,
                            width: objSize.width,
                            height: objSize.height,
                            borderColor: hitboxColor,
                        },
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    gameObject: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hitbox: {
        position: 'absolute',
        borderWidth: 1,
        opacity: 0.7,
    },
    coordinatesContainer: {
        alignItems: 'center',
    },
    coordinateText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    }
});

export { GameObject, GameObjectComponent };
export default GameObject;
