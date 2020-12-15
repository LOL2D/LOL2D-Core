let world;
let input;

function preload() {
    loadAssets();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    imageMode(CENTER);
    pixelDensity(1);
    Helper.Other.preventRightClick();

    cursor(globalassets.cursor.normal);

    world = new WorldCore({
        championsClassName: {
            player: Ahri,
            allies: [Ahri, Ahri, Ahri, Ahri],
            enemies: [Ahri, Ahri, Ahri, Ahri, Ahri],
        },
    });

    input = new InputCore({
        world: world,
    });
}

function draw() {
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
    Helper.UI.showFPS();
}

// ----------- p5js input -----------
function keyPressed() {
    input.keyPressed(keyCode);

    // test
    if (key == "z")
        world.camera.follow(
            world.champions[~~random(world.champions.length - 1)].position
        );
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
