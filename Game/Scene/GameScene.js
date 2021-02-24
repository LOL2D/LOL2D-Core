import Game from "../GameLogic/Game.js";

export default class GameScene {
    setup() {
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
        this.game.init();
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

    keyPressed() {}
}
