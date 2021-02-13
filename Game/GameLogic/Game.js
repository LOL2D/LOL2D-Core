import GameObject from "./GameObjects/GameObject.js";
import ObjectManager from "./ObjectManager.js";

export default class Game {
    constructor() {}

    initialize() {
        this.accumulator = 0;

        // test
        this.updateCount = 0;
        this.drawCount = 0;

        this.objectManager = new ObjectManager(this);
        this.objectManager.addObject(new GameObject(this));
    }

    gameLoop() {
        this.update_60Fps();
        this.draw();
    }

    update_60Fps() {
        // https://medium.com/@tglaiel/how-to-make-your-game-run-at-60fps-24c61210fe75
        this.accumulator += Math.min(deltaTime, 250);

        while (this.accumulator > 1000 / 61) {
            this.update(deltaTime);
            this.accumulator -= 1000 / 60;

            if (this.accumulator < 1000 / 59 - 1000 / 60) this.accumulator = 0;
        }
    }

    update(diff) {
        this.updateCount++;
        this.objectManager.update(diff);
    }

    draw() {
        this.drawCount++;
        background("#0d0f1a");

        fill(255);
        text(
            "Playing.." +
                `\n${this.updateCount} updates` +
                `\n${this.drawCount} draws.`,
            width / 2,
            height / 2
        );

        this.objectManager.draw();
    }
}
