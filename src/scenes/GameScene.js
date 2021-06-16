import EventType from "../enums/EventType.js";
import { on, emit } from "../EventManager.js";
import { preventRightClick } from "../gameCore/utils/Helpers.js";
import Game from "../gameCore/Game.js";

export default class GameScene {
    setup() {
        this.gameSceneDiv = document.querySelector("#game-scene");

        // prevent contex menu on canvas
        preventRightClick(document.querySelector("#game-scene canvas"));

        // stats
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        // game
        this.game = new Game();
    }

    enter() {
        // reset dom
        this.gameSceneDiv.style.display = "block";
        this.stats.dom.style.display = "block";
        this.game.enter();
    }

    exit() {
        this.gameSceneDiv.style.display = "none";
        this.stats.dom.style.display = "none";
        this.game.exit();
    }

    draw() {
        this.stats.begin();
        this.game.gameLoop();
        this.stats.end();
    }

    mouseMoved() {
        emit(EventType.MOUSE_MOVED);
    }
}
