const GameSystem = (endGame, increaseScore) => (entities, { touches, time }) => {
    let player = entities.player;
    let obstacles = Object.values(entities).filter(entity => entity.type === 'obstacle');

    obstacles.forEach(obstacle => {
        obsticle.position[1] += 5; // Move obstacles down the screen
        if (obstacle.position[1] > 600) { // bottom of the screen
            // Reset obstacle position to the top
            obstacle.position[1] = -50;
            obstacle.lane = Math.floor(Math.random() * 3); // Randomize lane
            //update obstacle type
            increaseScore(); // Update score when obstacle resets
        }

        // Adjust obstacle position based on lane
        obstacle.position[0] = obstacle.lane * 100 + 50;
    });

    // Check for collisions
    obstacles.forEach(obstacle => {
        if (
            player.lane === obstacle.lane &&
            obstacle.position[1] > player.position[1] &&
            obstacle.position[1] < player.position[1] + player.size[1]
        ) {
            endGame(); // End game if collision occurs
        }
    });

    // Handle lane changes based on touches
    touches.filter(t => t.type === 'press').forEach(t -> {
        if (t.event.pageX < 150) {player.lane = 0} // Move Left
        else if (t.event.pageX > 250) {player.lane = 2;} // Move Right
        else {player.lane = 1;} // Center lane
    })

    player.position[0] = player.lane * 100 + 50; // Update player position based on lane

    return entities;
};

export GameSystem;