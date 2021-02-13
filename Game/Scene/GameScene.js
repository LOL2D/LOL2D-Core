import Game from "../GameLogic/Game.js";

export default class GameScene {
    setup() {
        this.gameSceneDiv = document.querySelector("#game-scene");

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

        this.game.initialize();
    }

    exit() {
        this.gameSceneDiv.style.display = "none";
        this.stats.dom.style.display = "none";
    }

    draw() {
        this.stats.begin();
        this.game.gameLoop();
        this.stats.end();
    }

    keyPressed() {}
}
