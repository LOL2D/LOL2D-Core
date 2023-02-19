import StatsJs from "../../lib/stats.js";
import Game from "../game/Game.js";
import { emit } from "../managers/EventManager.js";
import { Scene } from "../managers/SceneManager.js";
import { preventRightClick } from "../utils/Helpers.js";

export default class GameScene extends Scene {
    setup() {
        this.gameSceneDiv = document.querySelector("#game-scene");
        preventRightClick(document.querySelector("#game-scene canvas"));

        // stats show fps
        // this.statsJs = new StatsJs();
        // this.statsJs.showPanel(0);
        // document.body.appendChild(this.statsJs.dom);
    }

    enter() {
        // reset dom
        this.gameSceneDiv.style.display = "block";
        // this.statsJs.dom.style.display = "block";

        this.game = new Game();
    }

    draw() {
        // this.statsJs.begin();
        this.game.gameLoop(deltaTime);
        // this.statsJs.end();
    }

    exit() {
        this.gameSceneDiv.style.display = "none";
        // this.statsJs.dom.style.display = "none";
    }

    mousePressed() {
        this.game.onMousePressed();
    }

    keyPressed() {
        this.game.onKeyPressed();
    }

    mouseWheel(e) {
        this.game.onMouseWheel(e);
    }
}
