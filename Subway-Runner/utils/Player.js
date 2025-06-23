const lanes = {
    'left': {
        lane : 0,
        positionX: 50
    },
    'middle': {
        lane : 1,
        positionX: 150
    },
    'right': {
        lane : 2,
        positionX: 250
    }
}

class Player{
    constructor(position = { x: 0, y: 0 }, lane, baseSpeed = 5.0) {
        this.id = Date.now() + Math.random().toString();
        this.position = position;
        this.lane = lane;
        this.size = { width: 50, height: 50 };
        this.color = "#4169e1"; // Player color
        this.borderRadius = 15; // Player border radius
        this.points = 0; // Initial points
        this.speed = baseSpeed; // Base speed for the player
    }

    setLane() {
        // this.position.x = this.lane * 100 + 50; // Update player position based on lane - OLD METHOD
        const lane = Object.values(lanes)
            .find(obj => obj.lane === this.lane);
        this.position.x = lane.positionX;
    }

    moveToLeftLane() {
        this.lane = lanes.left.lane; // 0
        this.setLane()
    }

    moveToMiddleLane() {
        this.lane = lanes.middle.lane;
        this.setLane()
    }

    moveToRightLane() {
        this.lane = lanes.right.lane;
        this.setLane()
    }
}

export default Player;