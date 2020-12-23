let world;
let input;
let stats;

function preload() {
    loadAssets();
    loadMap("summoner-rift-23-12-2020");
}

function setup() {
    createCanvas(windowWidth, windowHeight).position(0, 0);

    textAlign(CENTER, CENTER);
    imageMode(CENTER);
    pixelDensity(1);
    Helper.Other.preventRightClick();

    cursor(globalassets.cursor.normal);

    world = new WorldCore({
        terrainMapData: globalassets["summoner-rift-23-12-2020"],
        size: 6000,
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

    background(30);

    // run world
    world.run(() => {
        input.run();

        if (mouseIsPressed) {
            input.mouseIsPressed();
        }
        if (keyIsPressed) {
            input.keyDown(keyCode);
        }
    });

    // show fps
    //Helper.UI.showFPS();

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
        world.player.targetMove = m.copy();
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
