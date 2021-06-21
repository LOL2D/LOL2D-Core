import Champion from "./champions/Champion.js";
import Camera from "./maps/Camera.js";
import GroundMap from "./maps/GroundMap.js";

const fps = 60; // fixed update fps
let accumulator = 0;

export default class Game {
    constructor() {
        this.camera = new Camera();
        this.groundMap = new GroundMap(this);

        this.player = new Champion(
            this,
            createVector(100, 100),
            "asset/image/champion/ahri/Ahri.avatar.circle.png"
        );

        this.camera.follow(this.player.position);
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
        if (mouseIsPressed) {
            let m = this.camera.canvasToWorld(mouseX, mouseY);
            this.player.wayPoints = [createVector(m.x, m.y)];
        }

        this.player.update();
        this.camera.update();
    }

    update() {}

    draw() {
        background("#1E1E1E");
        this.camera.beginState();

        this.groundMap.drawEdge();
        this.groundMap.drawGrid();

        fill(255);
        circle(100, 100, 50);

        this.player.draw();

        this.camera.endState();
    }
}
