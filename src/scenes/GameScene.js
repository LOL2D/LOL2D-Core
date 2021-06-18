import StatsJs from "../../lib/stats.js";
import Game from "../game/Game.js";
import { Scene } from "../SceneManager.js";
import { preventRightClick } from "../utils/Helpers.js";

export default class GameScene extends Scene {
    setup() {
        this.gameSceneDiv = document.querySelector("#game-scene");

        // prevent contex menu on canvas
        preventRightClick(document.querySelector("#game-scene canvas"));

        // stats show fps
        this.statsJs = new StatsJs();
        this.statsJs.showPanel(0);
        document.body.appendChild(this.statsJs.dom);
    }

    enter() {
        // reset dom
        this.gameSceneDiv.style.display = "block";
        this.statsJs.dom.style.display = "block";

        this.game = new Game();
    }

    draw() {
        this.statsJs.begin();
        this.game.gameLoop(deltaTime);
        this.statsJs.end();
    }

    exit() {
        this.gameSceneDiv.style.display = "none";
        this.statsJs.dom.style.display = "none";
    }

    mousePressed() {}
}
