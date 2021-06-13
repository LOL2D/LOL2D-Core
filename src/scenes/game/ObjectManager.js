import Champion from "./champions/Champion.js";

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

    addChampion(championData, position) {
        let newChamp = new Champion(this.game, championData, position);
        this.champions.push(newChamp);
        return newChamp;
    }
}
