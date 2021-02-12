import LoadingScene from "./Scene/LoadingScene.js";

let mgr;

function setup() {
    createCanvas(800, 600).parent("#game-scene");

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

export default { setup };
