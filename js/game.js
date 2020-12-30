import { GlobalAssets, loadAssets, loadMap } from "./global/asset.global.js";
import GlobalGameConfig from "./global/game-config.global.js";
import GlobalTime from "./global/time.global.js";
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
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textFont(GlobalGameConfig.textFont);
    textSize(GlobalGameConfig.textSize);
    pixelDensity(GlobalGameConfig.pixelDensity);
    frameRate(GlobalGameConfig.limitFPS);
    Helper.Other.preventRightClick();

    cursor(GlobalAssets.cursor.normal);

    world = new WorldCore({
        terrainMapData: GlobalAssets["summoner-rift"],
        size: 6400,
        championsClassName: {
            player: Ahri,
            allies: [Ahri, Ahri],
            enemies: [Ahri, Ahri, Ahri],
        },
    });

    input = new InputCore({
        world: world,
    });

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // https://www.html5canvastutorials.com/tutorials/html5-canvas-shadow-text-tutorial/
    // drawingContext.shadowOffsetX = 3;
    // drawingContext.shadowOffsetY = 3;
    // drawingContext.shadowColor = "rgba(0,0,0,0.3)";
    // drawingContext.shadowBlur = 4;
}

function draw() {
    stats.begin();

    // lose focus
    if (!focused) {
        fill("#555");
        stroke("white");
        rect(width * 0.5 - 120, height * 0.5 - 50, 240, 100);

        fill("white");
        noStroke();
        text("PAUSED\n- click to continue -", width * 0.5, height * 0.5);
    }

    // focused
    else {
        GlobalTime.updateTime();

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
    if (key == "z") {
        world.camera.follow(
            world.champions[~~random(world.champions.length - 1)].position
        );
    } else if (key == "c") {
        let m = world.camera.canvasToWorld(mouseX, mouseY);

        world.player.position.set(m.x, m.y);
        world.player.destination.set(m.x, m.y);
    } else if (key == "g") {
        let m = world.camera.canvasToWorld(mouseX, mouseY);

        for (let champ of world.champions) {
            if (!champ.isAllyWithPlayer) {
                champ.position.set(m.x, m.y);
                champ.destination.set(m.x, m.y);
            }
        }
    } else if (key == "f") {
        let m = world.camera.canvasToWorld(mouseX, mouseY);

        for (let champ of world.champions) {
            if (champ.isAllyWithPlayer && champ != world.player) {
                champ.position.set(m.x, m.y);
                champ.destination.set(m.x, m.y);
            }
        }
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
