import GroundMap from "./GroundMap.js";

export default class GameMap {
    constructor(game) {
        this.game = game;
        this.terrains = {};
        this.groundMap = new GroundMap();
        // this.collisionHandler = null;
    }

    update() {
        // this.collisionHandler.update();
    }

    draw() {
        this.game.camera.beginState();
        this.groundMap.drawEdge();
        this.groundMap.drawGrid(this.game.camera.getViewport());
        this.game.camera.endState();
    }
}
