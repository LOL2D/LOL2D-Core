export default class GameScene {
    setup() {
        this.gameSceneDiv = document.querySelector("#game-scene");

        // stats
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    enter() {
        // reset dom
        this.gameSceneDiv.style.display = "block";
        this.stats.dom.style.display = "block";
    }

    exit() {
        this.gameSceneDiv.style.display = "none";
        this.stats.dom.style.display = "none";
    }

    draw() {
        this.stats.begin();

        background("#0d0f1a");
        fill(255);
        text("Game", width / 2, height / 2);

        this.stats.end();
    }

    keyPressed() {}
}
