const GameSystem = (endGame, increaseScore) => (entities, { touches, time }) => {
    let player = entities.player;
    let obstacles = Object.values(entities).filter(entity => entity.type === 'obstacle');

    obstacles.forEach(obstacle => {
        obstacle.moveDown()
        if (obstacle.position[1] > 600) { // bottom of the screen
            increaseScore(); // Update score when obstacle resets
        }
    });

    // Check for collisions
    obstacles.forEach(obstacle => {
        const checkCollision = obstacle.detectCollision(player);
        if (checkCollision) {
            endGame(); // End game if collision occurs
        }
    });

    // Handle lane changes based on touches
    touches.filter(t => t.type === 'press').forEach(t => {
        if (t.event.pageX < 150) {player.moveToLeftLane()} // Move Left
        else if (t.event.pageX > 250) {player.moveToRightLane()} // Move Right
        else {player.moveToMiddleLane();} // Center lane
    })

    player.position[0] = player.lane * 100 + 50; // Update player position based on lane

    return entities;
};

export default GameSystem;