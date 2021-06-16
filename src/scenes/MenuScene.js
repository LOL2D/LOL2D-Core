import { Scene } from "../SceneManager.js";
import GameScene from "./GameScene.js";

export default class MenuScene extends Scene {
    // override
    setup() {
        this.menuSceneDiv = document.querySelector("#menu-scene");
        this.playBtn = document.querySelector("#play-btn");

        this.playBtn.addEventListener("click", () => {
            this.sceneManager.showScene(GameScene);
        });
    }

    // override
    enter() {
        // reset dom
        this.menuSceneDiv.style.display = "block";

        this.sceneManager.showScene(GameScene);
    }

    // override
    exit() {
        // hide dom
        this.menuSceneDiv.style.display = "none";
    }
}
