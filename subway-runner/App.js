import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import Snowball from './components/Snowball';
import { Obstacle, OBSTACLE_TYPES, ObstacleComponent } from './components/Obstacle';

const { width, height } = Dimensions.get('window');

// Safety check to ensure OBSTACLE_TYPES is valid
const validObstacleTypes = OBSTACLE_TYPES ? Object.keys(OBSTACLE_TYPES).filter(type =>
    type !== 'DEFAULT' && OBSTACLE_TYPES[type]) : [];

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
                // console.log('Frame count:', frameCountRef.current);
                // console.log('Player position:', playerPosition);

                // Increment score
                setScore(prevScore => prevScore + 1);

                // Create new obstacles occasionally
                if (frameCountRef.current % 60 === 0) { // Every ~1 second (assuming 60fps)
                    const randomLane = Math.floor(Math.random() * 3);
                    const baseSpeed = 5 + Math.floor(score / 500);

                    try {
                        // Safely select a random obstacle type
                        let randomType = 'DEFAULT';
                        if (validObstacleTypes.length > 0) {
                            randomType = validObstacleTypes[Math.floor(Math.random() * validObstacleTypes.length)];
                        }

                        // Create new obstacle with constructor
                        const newObstacle = new Obstacle(
                            randomType,
                            { x: lanes[randomLane], y: -50 }, // Start above screen
                            baseSpeed
                        );

                        if (newObstacle) {
                            setObstacles(prevObstacles => [...prevObstacles, newObstacle]);
                        }
                    } catch (error) {
                        console.log('Error creating obstacle:', error);
                        console.log('Falling back to simple obstacle object.');
                        // Fallback to simple obstacle object if constructor fails
                        const simpleObstacle = {
                            id: Date.now() + Math.random().toString(),
                            type: 'DEFAULT',
                            position: { x: lanes[randomLane], y: -50 },
                            size: { width: 50, height: 50 },
                            color: 'red',
                            borderRadius: 5,
                            speed: baseSpeed,
                            updatePosition: function(deltaY) {
                                this.position.y += (deltaY || this.speed);
                                return this.position;
                            },
                            checkCollision: function(playerRect) {
                                const obstacleRect = {
                                    left: this.position.x,
                                    right: this.position.x + this.size.width,
                                    top: this.position.y,
                                    bottom: this.position.y + this.size.height,
                                };
                                return !(
                                    playerRect.left > obstacleRect.right ||
                                    playerRect.right < obstacleRect.left ||
                                    playerRect.top > obstacleRect.bottom ||
                                    playerRect.bottom < obstacleRect.top
                                );
                            }
                        };
                        setObstacles(prevObstacles => [...prevObstacles, simpleObstacle]);
                    }
                }

                // Move obstacles with error handling
                setObstacles(prevObstacles => {
                    const updatedObstacles = prevObstacles.map(obstacle => {
                        try {
                            if (obstacle && typeof obstacle.updatePosition === 'function') {
                                obstacle.updatePosition();
                            } else {
                                // Fallback if updatePosition is not available
                                if (obstacle && obstacle.position) {
                                    obstacle.position.y += (obstacle.speed || 5);
                                }
                            }
                            return obstacle;
                        } catch (error) {
                            console.log('Error updating obstacle position:', error);
                            return obstacle; // Return original if update failed
                        }
                    });

                    // Filter out undefined obstacles and those off screen
                    return updatedObstacles.filter(obstacle =>
                        obstacle &&
                        obstacle.position &&
                        obstacle.position.y < height
                    );
                });

                // Check for collisions
                const playerRect = {
                    left: playerPosition.x,
                    right: playerPosition.x + 50,
                    top: height - playerPosition.y - 50,
                    bottom: height - playerPosition.y,
                };

                const collision = obstacles.some(obstacle => obstacle.checkCollision(playerRect));

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
                            <Snowball position={playerPosition} />

                            {obstacles.map(obstacle => {
                                // Add safety checks to make sure all required properties exist
                                if (!obstacle || !obstacle.id || !obstacle.position) {
                                    return null; // Skip rendering this obstacle if essential properties are missing
                                }

                                return (
                                    <ObstacleComponent
                                        key={obstacle.id}
                                        position={obstacle.position || { x: 0, y: 0 }}
                                        size={obstacle.size || { width: 50, height: 50 }}
                                        color={obstacle.color || 'red'}
                                        borderRadius={obstacle.borderRadius || 0}
                                        type={obstacle.type || 'DEFAULT'}
                                    />
                                );
                            })}

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
