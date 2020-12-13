let world;
let input;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    Helper.Other.preventRightClick();

    world = new WorldCore();

    input = new InputCore({
        world: world,
    });
}

function draw() {
    background(30);

    // run world
    world.run(() => {
        // input
        input.run(createVector(mouseX, mouseY));

        if (mouseIsPressed) {
            input.mouseIsPressed();
        }
        if (keyIsPressed) {
            input.keyDown(keyCode);
        }
    });

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
    if (event.delta > 0) {
        if (world.camera.scaleTo > 0.5)
            world.camera.scaleTo -= world.camera.scaleTo / 10;
    } else {
        if (world.camera.scaleTo < 5)
            world.camera.scaleTo += world.camera.scaleTo / 10;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
}
