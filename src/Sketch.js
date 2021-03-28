import LoadingScene from "./scenes/loading/LoadingScene.js";

let mgr;

function setup() {
    createCanvas(windowWidth, windowHeight).parent("#game-scene");

    strokeJoin(ROUND);
    strokeCap(ROUND);
    imageMode(CENTER);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textFont("monospace");
    textSize(17);

    // scene manager
    mgr = new SceneManager();
    mgr.wire();

    // holding global data
    mgr.gameData = {};

    // open loading scene
    mgr.showScene(LoadingScene);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
}

export default { setup, windowResized };
