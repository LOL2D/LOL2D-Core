import Champion from "./champions/Champion.js";

const fps = 60; // fixed update fps
let accumulator = 0;

export default class Game {
    constructor() {
        this.player = new Champion(
            this,
            createVector(100, 100),
            "asset/image/champion/ahri/Ahri.avatar.circle.png"
        );
    }

    gameLoop(diff) {
        // https://medium.com/@tglaiel/how-to-make-your-game-run-at-60fps-24c61210fe75
        accumulator += Math.min(diff, 250);

        while (accumulator > 1000 / (fps + 1)) {
            this.fixedUpdate();
            accumulator -= 1000 / (fps - 1);
            if (accumulator < 1000 / (fps - 1) - 1000 / fps) accumulator = 0;
        }

        this.update();
        this.draw();
    }

    fixedUpdate() {
        this.player.update();
    }

    update() {}

    draw() {
        this.player.draw();
    }
}
