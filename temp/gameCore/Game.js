import ObjectManager from "./ObjectManager.js";
import Camera from "./maps/Camera.js";
import GameMap from "./maps/GameMap.js";

const fps = 60; // fixed update fps

export default class Game {
    constructor() {}

    enter() {
        this.accumulator = 0;

        this.camera = new Camera();
        this.gameMap = new GameMap(this);
        this.objectManager = new ObjectManager(this);
    }

    exit() {}

    gameLoop() {
        // https://medium.com/@tglaiel/how-to-make-your-game-run-at-60fps-24c61210fe75
        this.accumulator += Math.min(deltaTime, 250);

        while (this.accumulator > 1000 / (fps + 1)) {
            this.fixedUpdate();
            this.accumulator -= 1000 / (fps - 1);

            if (this.accumulator < 1000 / (fps - 1) - 1000 / fps)
                this.accumulator = 0;
        }

        this.update();
        this.draw();
    }

    fixedUpdate() {}

    update() {
        this.objectManager.update();
        this.camera.update();
    }

    draw() {
        background("#1E1E1E");

        this.camera.beginState();
        this.gameMap.draw();
        this.objectManager.draw();
        this.camera.endState();
    }
}
