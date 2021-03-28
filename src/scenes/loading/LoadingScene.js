import AssetManager from "../../AssetManager.js";
import MenuScene from "../menu/MenuScene.js";

export default class LoadingScene {
    setup() {
        this.loadingSceneDiv = document.querySelector("#loading-scene");
        this.loadingAnimation = this.loadingSceneDiv.querySelector(".loading");
        this.loadingText = this.loadingSceneDiv.querySelector(".loading-text");
        this.errorText = this.loadingSceneDiv.querySelector(".error-text");
    }

    enter() {
        // reset dom
        this.loadingSceneDiv.style.display = "block";
        this.loadingAnimation.style.display = "block";
        this.loadingText.innerHTML = "0%";
        this.errorText.innerHTML = "";

        // load assets
        AssetManager.loadAssets(
            // progress
            ({ index, total, path }) => {
                this.loadingText.innerHTML = round((index / total) * 100) + "%";
            },

            // success
            () => {
                setTimeout(() => {
                    this.sceneManager.showScene(MenuScene);
                }, 1);
            },

            // failed
            (error) => {
                this.loadingAnimation.style.display = "none";
                this.errorText.innerHTML = `ERROR: Failed to load assets. ${error.path[0].currentSrc}`;
            }
        );
    }

    exit() {
        // hide dom
        this.loadingSceneDiv.style.display = "none";
    }
}
