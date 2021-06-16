import { Scene } from "../SceneManager.js";
import AssetManager from "../AssetManager.js";
import MenuScene from "./MenuScene.js";

export default class LoadingScene extends Scene {
    // override
    setup() {
        this.loadingSceneDiv = document.querySelector("#loading-scene");
        this.loadingAnimation = this.loadingSceneDiv.querySelector(".loading");
        this.loadingText = this.loadingSceneDiv.querySelector(".loading-text");
        this.errorText = this.loadingSceneDiv.querySelector(".error-text");
    }

    // override
    enter() {
        // reset dom
        this.loadingSceneDiv.style.display = "block";
        this.loadingAnimation.style.display = "block";
        this.loadingText.innerHTML = "0%";
        this.errorText.innerHTML = "";

        const errorAssets = [];

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
                errorAssets.push(error.path[0].currentSrc);
                this.errorText.innerHTML = `ERROR: Failed to load assets. ${errorAssets.join("\n")}`;
            }
        );
    }

    // override
    exit() {
        // hide dom
        this.loadingSceneDiv.style.display = "none";
    }
}
