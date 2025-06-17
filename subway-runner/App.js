import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import Player from './components/Player';
import Obstacle from './components/Obstacle';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: width / 2 - 25, y: 100 });
  const [obstacles, setObstacles] = useState([]);
  const gameLoopRef = useRef(null);
  const frameCountRef = useRef(0);

  const lanes = [width * 0.25 - 25, width * 0.5 - 25, width * 0.75 - 25];
  const currentLaneIndex = useRef(1); // Start in middle lane

  // Game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Set up game loop
      gameLoopRef.current = setInterval(() => {
        frameCountRef.current += 1;

        // Increment score
        setScore(prevScore => prevScore + 1);

        // Create new obstacles occasionally
        if (frameCountRef.current % 60 === 0) { // Every ~1 second (assuming 60fps)
          const randomLane = Math.floor(Math.random() * 3);
          const newObstacle = {
            id: Date.now(),
            position: { x: lanes[randomLane], y: -50 }, // Start above screen
            size: { width: 50, height: 50 },
            speed: 5 + Math.floor(score / 500), // Increase speed as score increases
          };

          setObstacles(prevObstacles => [...prevObstacles, newObstacle]);
        }

        // Move obstacles
        setObstacles(prevObstacles => {
          const updatedObstacles = prevObstacles.map(obstacle => ({
            ...obstacle,
            position: { ...obstacle.position, y: obstacle.position.y + obstacle.speed }
          }));

          // Remove obstacles that are off screen
          return updatedObstacles.filter(obstacle => obstacle.position.y < height);
        });

        // Check for collisions
        const playerRect = {
          left: playerPosition.x,
          right: playerPosition.x + 50,
          top: height - playerPosition.y - 50,
          bottom: height - playerPosition.y,
        };

        const collision = obstacles.some(obstacle => {
          const obstacleRect = {
            left: obstacle.position.x,
            right: obstacle.position.x + obstacle.size.width,
            top: obstacle.position.y,
            bottom: obstacle.position.y + obstacle.size.height,
          };

          return !(
            playerRect.left > obstacleRect.right ||
            playerRect.right < obstacleRect.left ||
            playerRect.top > obstacleRect.bottom ||
            playerRect.bottom < obstacleRect.top
          );
        });

        if (collision) {
          setGameOver(true);
          clearInterval(gameLoopRef.current);
        }
      }, 16); // ~60fps

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameStarted, gameOver]);

  const moveLeft = () => {
    if (currentLaneIndex.current > 0) {
      currentLaneIndex.current -= 1;
      setPlayerPosition(prev => ({ ...prev, x: lanes[currentLaneIndex.current] }));
    }
  };

  const moveRight = () => {
    if (currentLaneIndex.current < 2) {
      currentLaneIndex.current += 1;
      setPlayerPosition(prev => ({ ...prev, x: lanes[currentLaneIndex.current] }));
    }
  };

  const resetGame = () => {
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setPlayerPosition({ x: width / 2 - 25, y: 100 });
    setObstacles([]);
    frameCountRef.current = 0;
    currentLaneIndex.current = 1;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {!gameStarted ? (
          <View style={styles.menuContainer}>
            <Text style={styles.title}>Subway Runner</Text>
            <Text
              style={styles.startButton}
              onPress={() => setGameStarted(true)}
            >
              Start Game
            </Text>
          </View>
        ) : (
          <View style={styles.gameContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>

            {/* Game area */}
            <View style={styles.gameArea}>
              <Player position={playerPosition} />

              {obstacles.map(obstacle => (
                <Obstacle
                  key={obstacle.id}
                  position={obstacle.position}
                  size={obstacle.size}
                  speed={obstacle.speed}
                />
              ))}

              {/* Lane dividers */}
              <View style={[styles.lane, { left: width * 0.33 }]} />
              <View style={[styles.lane, { left: width * 0.66 }]} />
            </View>

            {/* Game controls */}
            <View style={styles.gameControls}>
              <Text
                style={styles.controlButton}
                onPress={moveLeft}
              >
                ← Left
              </Text>
              <Text
                style={styles.controlButton}
                onPress={moveRight}
              >
                Right →
              </Text>
            </View>

            {/* Game over overlay */}
            {gameOver && (
              <View style={styles.gameOverContainer}>
                <Text style={styles.gameOverText}>Game Over</Text>
                <Text style={styles.finalScoreText}>Score: {score}</Text>
                <Text
                  style={styles.restartButton}
                  onPress={resetGame}
                >
                  Play Again
                </Text>
              </View>
            )}
          </View>
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  menuContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    position: 'relative',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    position: 'relative',
    overflow: 'hidden',
  },
  lane: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  gameControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScoreText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
