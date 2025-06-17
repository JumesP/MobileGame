const Physics = (endGame) => (entities, { touches, time }) => {
  let player = entities.player;
  let obstacles = [entities.obstacle1, entities.obstacle2];

  // Move obstacles down
  obstacles.forEach(obstacle => {
    obstacle.position[1] += 5;
    if (obstacle.position[1] > 600) {
      obstacle.position[1] = -50;
      obstacle.lane = Math.floor(Math.random() * 3);
    }

    // Adjust obstacle position based on lane
    obstacle.position[0] = obstacle.lane * 100 + 50;
  });

  // Check collision
  obstacles.forEach(obstacle => {
    if (
      player.lane === obstacle.lane &&
      obstacle.position[1] > player.position[1] &&
      obstacle.position[1] < player.position[1] + player.size[1]
    ) {
      endGame();
    }
  });

  // Handle lane switching
  touches.filter(t => t.type === 'press').forEach(t => {
    if (t.event.pageX < 100) player.lane = 0;
    else if (t.event.pageX < 200) player.lane = 1;
    else player.lane = 2;
  });

  player.position[0] = player.lane * 100 + 50;

  return entities;
};

export default Physics;
