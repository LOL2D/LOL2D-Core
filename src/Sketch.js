import SceneManager from "./SceneManager.js";
import LoadingScene from "./scenes/LoadingScene.js";

function setup() {
    createCanvas(windowWidth, windowHeight).parent("#game-scene");

    // global p5js setting
    strokeJoin(ROUND);
    strokeCap(ROUND);
    imageMode(CENTER);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textFont("monospace");
    textSize(17);

    // scene manager
    let mgr = new SceneManager();
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
