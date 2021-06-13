import Game from "./Game.js";

export default class GameScene {
    static instance = null;

    setup() {
        GameScene.instance = this;

        this.gameSceneDiv = document.querySelector("#game-scene");

        // prevent contex menu on canvas
        this.gameSceneDiv.getElementsByTagName("canvas")[0].addEventListener(
            "contextmenu",
            function (evt) {
                evt.preventDefault();
            },
            false
        );

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
}
