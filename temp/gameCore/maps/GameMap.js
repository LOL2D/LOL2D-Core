import GroundMap from "./GroundMap.js";

export default class GameMap {
    constructor(game) {
        this.game = game;
        this.groundMap = new GroundMap();
    }

    update() {
    }

    draw() {
        let viewport = this.game.camera.getViewport();

        this.groundMap.drawEdge();
        this.groundMap.drawGrid(viewport);
    }
}
