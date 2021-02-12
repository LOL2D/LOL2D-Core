import GameScene from "./GameScene.js";

export default class MenuScene {
    setup() {
        this.menuSceneDiv = document.querySelector("#menu-scene");
        this.playBtn = document.querySelector("#play-btn");

        this.playBtn.addEventListener("click", () => {
            this.sceneManager.showScene(GameScene);
        });
    }

    enter() {
        // reset dom
        this.menuSceneDiv.style.display = "block";

        this.sceneManager.showScene(GameScene);
    }

    exit() {
        // hide dom
        this.menuSceneDiv.style.display = "none";
    }
}
