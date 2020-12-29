import Helper from "./helper/index.js";
import WorldCore from "./core/world.core.js";
import InputCore from "./core/input.core.js";

import Ahri from "./extends/champion/ahri/ahri.champion.js";

let world;
let input;
let stats;

function preload() {
    loadAssets();
    loadMap("summoner-rift");
}

function setup() {
    createCanvas(windowWidth, windowHeight).position(0, 0);

    strokeJoin(ROUND);
    strokeCap(ROUND);
    textAlign(CENTER, CENTER);
    textSize(17);
    textFont("monospace");
    imageMode(CENTER);
    pixelDensity(1);
    frameRate(60);
    Helper.Other.preventRightClick();

    cursor(globalassets.cursor.normal);

    world = new WorldCore({
        terrainMapData: globalassets["summoner-rift"],
        size: 6400,
        championsClassName: {
            player: Ahri,
            allies: [Ahri, Ahri, Ahri, Ahri],
            enemies: [Ahri, Ahri, Ahri, Ahri, Ahri],
        },
    });

    input = new InputCore({
        world: world,
    });

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
}

function draw() {
    stats.begin();

    // lose focus
    if (!focused) {
        fill("#555");
        stroke("white");
        rect(width / 2 - 100, height / 2 - 50, 200, 100);

        fill("white");
        noStroke();
        text("PAUSED\n-click to continue-", width / 2, height / 2);
    }

    // focused
    else {
        world.fixedUpdate();

        world.show(() => {
            input.run();

            if (mouseIsPressed) {
                input.mouseIsPressed();
            }
            if (keyIsPressed) {
                input.keyDown(keyCode);
            }
        });
    }

    stats.end();
}

// ----------- p5js input -----------
function keyPressed() {
    input.keyPressed(keyCode);

    // test
    if (key == "z")
        world.camera.follow(
            world.champions[~~random(world.champions.length - 1)].position
        );
    else if (key == "d") {
        let m = world.camera.canvasToWorld(mouseX, mouseY);

        world.player.position.set(m.x, m.y);
        world.player.destination.set(m.x, m.y);
    }
}
function keyReleased() {
    input.keyReleased(keyCode);
}
function keyTyped() {}

function mousePressed() {
    input.mousePressed();
}
function mouseReleased() {}
function mouseClicked() {}
function mouseDragged() {}
function mouseMoved() {}
function doubleClicked() {}

function mouseWheel(event) {
    input.mouseWheel(event);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
    world.resizeWindow(windowWidth, windowHeight);
}

console.log("game.js was loaded...");

export default {
    preload,
    setup,
    draw,
    keyPressed,
    keyReleased,
    keyTyped,
    mousePressed,
    mouseReleased,
    mouseClicked,
    mouseDragged,
    mouseMoved,
    doubleClicked,
    mouseWheel,
    windowResized,
};
