import ObjectManager from "../../ObjectManager.js";
import InputManager from "../../InputManager.js";
import Camera from "./maps/Camera.js";
import GameMap from "./maps/GameMap.js";

export default class Game {
    constructor() {}

    init() {
        this.accumulator = 0;
        this.paused = false;

        this.camera = new Camera();
        this.gameMap = new GameMap(this);
        this.objectManager = new ObjectManager(this);
        this.inputManager = new InputManager(this);
    }

    exit() {
        this.inputManager.disconnect();
    }

    gameLoop() {
        if (!this.paused) this.fixedUpdate();
        this.draw();
    }

    fixedUpdate(fps = 60) {
        // https://medium.com/@tglaiel/how-to-make-your-game-run-at-60fps-24c61210fe75
        this.accumulator += Math.min(deltaTime, 250);

        while (this.accumulator > 1000 / (fps + 1)) {
            this.update(deltaTime);
            this.accumulator -= 1000 / (fps - 1);

            if (this.accumulator < 1000 / (fps - 1) - 1000 / fps)
                this.accumulator = 0;
        }
    }

    update(diff) {
        this.inputManager.update(diff);
        this.objectManager.update(diff);
        this.camera.update();
    }

    draw() {
        background("#0d0f1a");

        this.gameMap.draw();
        this.objectManager.draw();
    }
}
