import GroundMap from "./GroundMap.js";
import TerrainMap from "./TerrainMap.js";

export default class GameMap {
    constructor(game) {
        this.game = game;
        this.terrainMap = new TerrainMap();
        this.groundMap = new GroundMap();
        // this.collisionHandler = null;
    }

    update(diff) {
        // this.collisionHandler.update(diff);
    }

    draw() {
        let viewport = this.game.camera.getViewport();

        this.game.camera.beginState();
        this.groundMap.drawEdge();
        this.groundMap.drawGrid(viewport);
        this.terrainMap.drawTerrain();
        this.game.camera.endState();
    }
}
