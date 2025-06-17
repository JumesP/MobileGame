import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Player from './components/Player';
import Obstacle from './components/Obstacle';
import Physics from './components/Physics';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';

export default function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'end'

  const startGame = () => setGameState('playing');
  const endGame = () => setGameState('end');

  const entities = {
    player: { position: [1, 500], size: [50, 50], lane: 1, renderer: <Player /> },
    obstacle1: { position: [1, 0], size: [50, 50], lane: Math.floor(Math.random() * 3), renderer: <Obstacle /> },
    obstacle2: { position: [1, -200], size: [50, 50], lane: Math.floor(Math.random() * 3), renderer: <Obstacle /> },
  };

  return (
    <View style={styles.container}>
      {gameState === 'start' && <StartScreen onStart={startGame} />}
      {gameState === 'end' && <EndScreen onRestart={startGame} />}
      {gameState === 'playing' && (
        <View style={styles.gameContainer}>
          <View style={styles.laneDivider} />
          <View style={styles.laneDividerSecond} />
          <GameEngine
            style={styles.gameEngine}
            systems={[Physics(endGame)]}
            entities={entities}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gameContainer: {
    flex: 1,
    position: 'relative',
  },
  gameEngine: {
    flex: 1,
  },
  laneDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'black',
    left: '33.33%', // First divider
    transform: [{ translateX: -1 }],
  },
  laneDividerSecond: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'black',
    left: '66.66%', // Second divider
    transform: [{ translateX: -1 }],
  },
});
