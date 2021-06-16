import { Scene } from "../SceneManager.js";
import { preventRightClick } from "../utils/Helpers.js";

export default class GameScene extends Scene {
    // override
    setup() {
        this.gameSceneDiv = document.querySelector("#game-scene");

        // prevent contex menu on canvas
        preventRightClick(document.querySelector("#game-scene canvas"));

        // stats show fps
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    // override
    enter() {
        // reset dom
        this.gameSceneDiv.style.display = "block";
        this.stats.dom.style.display = "block";
    }

    // override
    draw() {
        this.stats.begin();
        // TODO: game loop here
        this.stats.end();
    }

    // override
    exit() {
        this.gameSceneDiv.style.display = "none";
        this.stats.dom.style.display = "none";
    }

    mousePressed() {
        console.log("mousePressed")
    }
    
    mouseDragged() {
        console.log("dragged")
    }
}
