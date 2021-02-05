import LoadingScene from "./scene/loading.scene.js";

let stats;
let mgr;

function setup() {
    createCanvas(800, 600);

    strokeJoin(ROUND);
    strokeCap(ROUND);
    imageMode(CENTER);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textFont("monospace");
    textSize(17);

    // stats
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // scene manager
    mgr = new SceneManager();

    // holding global data
    mgr.gameData = {};

    // open loading scene
    mgr.showScene(LoadingScene);
}

function draw() {
    stats.begin();
    mgr.draw();
    stats.end();
}

export default { setup, draw };
