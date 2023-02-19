import { Scene } from "../managers/SceneManager.js";
import PreGameScene from "./PreGameScene.js";

export default class MenuScene extends Scene {
    setup() {
        this.menuSceneDiv = document.querySelector("#menu-scene");
        this.playBtn = document.querySelector("#play-btn");

        this.playBtn.addEventListener("click", () => {
            this.sceneManager.showScene(PreGameScene);
        });
    }
    enter() {
        // reset dom
        this.menuSceneDiv.style.display = "block";
        this.sceneManager.showScene(PreGameScene);
    }

    exit() {
        // hide dom
        this.menuSceneDiv.style.display = "none";
    }
}
