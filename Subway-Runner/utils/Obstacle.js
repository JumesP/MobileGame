import React from "react";
import { View, StyleSheet } from "react-native";

const OBSTACLE_TYPE = {
    CAR: {
        id: "CAR",
        width: 50,
        height: 80,
        color: "#ff6347",
        borderRadius: 5,
        points: 15,
        speed: 1.2
    },
    PERSON: {
        id: "PERSON",
        width: 35,
        height: 45,
        color: "#4169e1",
        borderRadius: 15,
        points: 10,
        speed: 0.9
    },
    BUILDING: {
        id: "BUILDING",
        width: 70,
        height: 100,
        color: "#808080",
        borderRadius: 2,
        points: 25,
        speed: 0.7
    },
    DEFAULT: {
        id: "DEFAULT",
        width: 50,
        height: 50,
        color: "#000",
        borderRadius: 5,
        points: 5,
        speed: 1.0
    }
}

class Obstacle {
    constructor(type = "DEFAULT", position = { x: 0, y: 0 }, lane, baseSpeed = 5.0) {
        const obstacleType = OBSTACLE_TYPE[type] || OBSTACLE_TYPE.DEFAULT;

        this.id = Date.now() + Math.random().toString();
        this.type = obstacleType.id;
        this.position = position;
        this.lane = lane;
        this.size = {
            width: obstacleType.width,
            height: obstacleType.height
        };
        this.color = obstacleType.color;
        this.borderRadius = obstacleType.borderRadius;
        this.points = obstacleType.points;
        this.speed = obstacleType.speed * baseSpeed;
    }

    moveDown() {
        this.position.y += this.speed;
        if (this.position.y > 600) {
            this.resetPosition();
        }
    }

    resetPosition() {
        this.position.y = 0 - this.size.height;
        this.lane = Math.floor(Math.random() * 3); // Randomize lane

        // Make it so the horizontal position is based on the lane - which should be x?

        // |   |   | x |

        // Adjust obstacle position based on lane
        this.position.x = this.lane * 100 + 50; // lane 0 = 50px | lane 1 = 150px | lane 2 = 250px
    }

    detectCollision(player) {
        return (
            this.lane === player.lane &&
            this.position.y + this.size.height > player.position.y &&
            this.position.y < player.position.y + player.size.height
        );
    }

    // static
    static pickRandomObstacleType() {
        const obstacleTypes = Object.keys(OBSTACLE_TYPE);
        return obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    }



    // generateRandomObstacle(position = { x: 0, y: 0 }, lane, baseSpeed = 5.0) {
    //     const obstacleTypes = Object.keys(OBSTACLE_TYPE);
    //     const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    //     return new Obstacle(randomType, position, lane, baseSpeed);
    // }
}

export default Obstacle;