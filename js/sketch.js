import { GlobalAssets, loadAssets, loadMap } from "./global/asset.global.js";
import GlobalGameConfig from "./global/game-config.global.js";
import GlobalTime from "./global/time.global.js";
import Helper from "./helper/index.js";
import WorldCore from "./core/world.core.js";
import InputCore from "./core/input.core.js";

import Ahri from "./extends/champion/ahri/ahri.champion.js";
import Jinx from "./extends/champion/jinx/jinx.champion.js";

let world;
let input;
let stats;
let loadedAsset = false;
let loadedMap = false;
let playing = false;

function preload() {}

function preloadData() {
    loadAssets(() => {
        console.log("load asset finished");
        loadedAsset = true;

        cursor(GlobalAssets.cursor.hand);
    });

    loadMap("summoner-rift", () => {
        console.log("load map finished");
        loadedMap = true;

        world = new WorldCore({
            terrainMapData: GlobalAssets["summoner-rift"],
            size: 6400,
            championsClassName: {
                player: Ahri,
                allies: [Ahri],
                enemies: [Ahri, Ahri],
            },
        });

        input = new InputCore({
            world: world,
        });
    });
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
    frameRate(GlobalGameConfig.limitFPS);
    if (GlobalGameConfig.pixelDensity)
        pixelDensity(GlobalGameConfig.pixelDensity);

    Helper.Other.preventRightClick();

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    preloadData();
}

function draw() {
    stats.begin();

    // loading
    if (!loadedAsset || !loadedMap) {
        background(30);

        fill("white");
        text("Loading", width / 2, height / 2);
    }

    // loaded
    else {
        // lose focus
        if (!focused || !playing) {
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
        world.player.moveTo(m.x, m.y);
    } else if (key == "g") {
        let m = world.camera.canvasToWorld(mouseX, mouseY);

        for (let champ of world.champions) {
            if (!champ.isAllyWithPlayer) {
                champ.position.set(m.x, m.y);
                champ.moveTo(m.x, m.y);
            }
        }
    } else if (key == "f") {
        let m = world.camera.canvasToWorld(mouseX, mouseY);

        for (let champ of world.champions) {
            if (champ.isAllyWithPlayer && champ != world.player) {
                champ.position.set(m.x, m.y);
                champ.moveTo(m.x, m.y);
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
    if (!playing) playing = true;
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

console.log("sketch.js was loaded...");

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
