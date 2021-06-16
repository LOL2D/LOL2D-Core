export default class ObjectManager {
    constructor(game) {
        this.game = game;
        this.champions = [];
    }

    update() {
        for (let champion of this.champions) {
            champion.update();
        }
    }

    draw() {
        for (let champion of this.champions) {
            champion.draw();
        }
    }
}
