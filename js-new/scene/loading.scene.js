import MenuScene from "./menu.scene.js";

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
        this.loaded = 0;
        this.errorText = "";

        // holding global assets data
        this.sceneManager.gameData.assets = {};

        // load assets
        let i = 0;

        for (let path of assetPaths) {
            loadImage(
                path,
                // success
                (data) => {
                    this.sceneManager.gameData.assets[path] = data;

                    i++;
                    this.loaded = i / assetPaths.length;
                },
                // failed
                (error) => {
                    this.errorText = error.path[0].currentSrc;
                    console.log(error);
                }
            );
        }
    }

    draw() {
        background(30);

        // failed
        if (this.errorText) {
            fill("red");
            text(
                "ERROR: Failed to load assets. " + this.errorText,
                width / 2,
                height / 2
            );
        }

        // loading
        else {
            fill(255);
            text(
                `Loading ${round(this.loaded * 100)}%...`,
                width / 2,
                height / 2
            );

            if (this.loaded == 1) {
                this.sceneManager.showScene(MenuScene);
            }
        }
    }
}
