import GameScene from "./game.scene.js";

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
    }

    exit() {
        // hide dom
        this.menuSceneDiv.style.display = "none";
    }
}
