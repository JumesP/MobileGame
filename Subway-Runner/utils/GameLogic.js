import React, { useState } from 'react';
import { GameEngine } from 'react-native-game-engine';
import { StyleSheet, View, Text } from 'react-native';
import Player from '../components/Player';
import Obstacle from '../components/Obstacle';
import PlayerClass from './Player';
import ObstacleClass from './Obstacle';
import GameSystem from './GameSystem';

const GameLogic = () => {
    const [gameState, setGameState] = useState('start'); // start, playing, end
    const [score, setScore] = useState(0);

    const startGame = () => {
        setGameState('playing');
        // Initialize game entities, score, etc.
    };

    const endGame = () => {
        setGameState('end');
        // Handle game over logic, show score, etc.
    };

    const increaseScore = () => setScore(prevScore => prevScore + 1);

    // Initialize a player instance with the Player class
    const playerInstance = new PlayerClass({x: 150, y: 500}, 1); // Start in middle lane

    // Initialize obstacle instances with the Obstacle class
    const obstacle1Instance = new ObstacleClass(
        ObstacleClass.pickRandomObstacleType(), // Use one of the defined types: CAR, PERSON, BUILDING
        {x: 50, y: 0},
        Math.floor(Math.random() * 3), // Random lane (0, 1, or 2)
        5.0 // Base speed
    );

    const obstacle2Instance = new ObstacleClass(
        ObstacleClass.pickRandomObstacleType(),
        {x: 150, y: -200},
        Math.floor(Math.random() * 3),
        5.0
    );

    const entities = {
        player: {
            ...playerInstance, // Include all Player class properties
            renderer: <Player position={playerInstance.position} /> // Pass position to the component
        },
        obstacle1: {
            ...obstacle1Instance, // Include all Obstacle class properties
            type: 'obstacle', // Tag for filtering in GameSystem
            renderer: <Obstacle
                position={obstacle1Instance.position}
                size={obstacle1Instance.size}
                color={obstacle1Instance.color}
                borderRadius={obstacle1Instance.borderRadius}
            />
        },
        obstacle2: {
            ...obstacle2Instance,
            type: 'obstacle', // Tag for filtering in GameSystem
            renderer: <Obstacle
                position={obstacle2Instance.position}
                size={obstacle2Instance.size}
                color={obstacle2Instance.color}
                borderRadius={obstacle2Instance.borderRadius}
            />
        },
    }

    return (
        <View style={styles.container}>
            {gameState === 'playing' && (
                <View style={styles.gameContainer}>
                    <Text style={styles.score}>Score</Text>
                    <View style={styles.laneDivider}/>
                    <View style={styles.laneDividerTwo}/>
                    <GameEngine
                        style={styles.gameEngine}
                        systems={[GameSystem(endGame, increaseScore)]}
                        entities={entities}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default GameLogic;