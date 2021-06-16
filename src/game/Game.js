const fps = 60; // fixed update fps

export default class Game {
    constructor() {
        this.accumulator = 0;
    }

    gameLoop(diff) {
        // https://medium.com/@tglaiel/how-to-make-your-game-run-at-60fps-24c61210fe75
        this.accumulator += Math.min(diff, 250);

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

    update() {}

    draw() {

    }
}
