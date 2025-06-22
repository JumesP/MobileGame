import React, { useState } from 'react';
import { GameEngine } from 'react-native-game-engine';
import { StyleSheet, View, Text } from 'react-native';

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

    const entities = {
        player: { position: [1, 500], size: [50, 50], lane: 1, renderer: <Player /> },
        obstacle1: { position: [1, 0], size: [50, 50], lane: Math.floor(Math.random() * 3), renderer: <Obstacle /> },
        obstacle2: { position: [1, -200], size: [50, 50], lane: Math.floor(Math.random() * 3), renderer: <Obstacle /> },
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