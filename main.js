let world;
let input;

function preload() {
    loadAssets();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    imageMode(CENTER);
    Helper.Other.preventRightClick();

    world = new WorldCore({
        championsClassName: {
            player: Ahri,
            allies: [Ahri],
            enemies: [Ahri, Ahri],
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
