import MenuScene from "./Menu.js";

const assetPaths = [
    // hud
    "asset/image/hud/ability.png",
    "asset/image/hud/item.png",
    "asset/image/hud/avatar.png",

    // spell
    "asset/image/spell/Flash.png",

    // ahri
    "asset/image/champion/ahri/Ahri.avatar.circle.png",
    "asset/image/champion/ahri/Ahri.avatar.square.png",
    "asset/image/champion/ahri/Charm.ability.png",
    "asset/image/champion/ahri/Fox-Fire.ability.png",
    "asset/image/champion/ahri/Orb-of-Deception.ability.png",
    "asset/image/champion/ahri/Spirit-Rush.ability.png",

    // jinx
    "asset/image/champion/jinx/Jinx.avatar.circle.png",
];

export default class LoadingScene {
    setup() {
        this.loadingSceneDiv = document.querySelector("#loading-scene");
        this.loadingAnimation = this.loadingSceneDiv.querySelector(".loading");
        this.loadingText = this.loadingSceneDiv.querySelector(".loading-text");
        this.errorText = this.loadingSceneDiv.querySelector(".error-text");

        // holding global assets data
        this.sceneManager.gameData.assets = {};
    }

    enter() {
        // reset dom
        this.loadingSceneDiv.style.display = "block";
        this.loadingAnimation.style.display = "block";
        this.loadingText.innerHTML = "0%";
        this.errorText.innerHTML = "";

        let loadedCount = 0;
        let hasError = false;

        // load assets
        for (let path of assetPaths) {
            loadImage(
                path,
                // success
                (data) => {
                    this.sceneManager.gameData.assets[path] = data;

                    loadedCount++;
                    this.loadingText.innerHTML =
                        round((loadedCount / assetPaths.length) * 100) + "%";

                    if (loadedCount == assetPaths.length && !hasError) {
                        setTimeout(() => {
                            this.sceneManager.showScene(MenuScene);
                        }, 1000);
                    }
                },
                // failed
                (error) => {
                    hasError = true;
                    this.loadingAnimation.style.display = "none";
                    this.errorText.innerHTML = `ERROR: Failed to load assets. ${error.path[0].currentSrc}`;
                }
            );
        }
    }

    exit() {
        // hide dom
        this.loadingSceneDiv.style.display = "none";
    }
}
