export default class Game {
    constructor() {}

    initialize(config) {
        this.gameTime = 0;
        this.accumulator = 0;
    }

    initializePacketHandlers() {}

    gameLoop() {
        this.gameTime += deltaTime;

        // https://medium.com/@tglaiel/how-to-make-your-game-run-at-60fps-24c61210fe75
        this.accumulator += Math.min(deltaTime, 250);

        while (this.accumulator > 1000 / 61) {
            this.update(deltaTime);
            this.accumulator -= 1000 / 60;

            if (this.accumulator < 1000 / 59 - 1000 / 60) this.accumulator = 0;
        }
    }

    update(diff) {
        fill(255);
        text("Playing", width / 2, height / 2);
    }
}
