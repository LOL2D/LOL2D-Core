let p1, p2;
let camera;
let gamemap;
let input;
let abilityObjs = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    Utils.preventRightClick();

    gamemap = new GameMapCore();
    camera = new CameraCore();
    input = new InputCore();

    p1 = new Ahri({
        bound: gamemap.getBound(),
    });
    p2 = new Ahri({
        position: createVector(500, 500),
        bound: gamemap.getBound(),
    });

    camera.target = p1.position;
    input.champion = p1;
}

function draw() {
    background(30);

    // control by mouse
    if (mouseIsPressed) {
        if (mouseButton == RIGHT) {
            let worldPos = camera.convert(mouseX, mouseY);
            p1.moveTo(worldPos.x, worldPos.y);
        }
    }

    // begin camera
    camera.beginState();

    gamemap.drawEdge();
    gamemap.drawGrid(camera);

    // input
    if (keyIsPressed) {
        input.keyDown(keyCode, camera.convert(mouseX, mouseY));
    }

    input.run(camera.convert(mouseX, mouseY));

    // champions
    p1.run();
    p2.run();

    // ability objects
    for (let i = abilityObjs.length - 1; i >= 0; i--) {
        abilityObjs[i].run();

        if (abilityObjs[i].overlap(p2)) {
            abilityObjs[i].effect(p2);
        }

        if (abilityObjs[i].checkFinished()) {
            abilityObjs.splice(i, 1);
        }
    }

    camera.endState();

    Utils.showFPS();
}

// ----------- p5js input -----------
function keyPressed() {
    input.keyPressed(keyCode);
}
function keyReleased() {
    let newSpellObject = input.keyReleased(keyCode);

    if (newSpellObject) {
        if (Array.isArray(newSpellObject)) abilityObjs.push(...newSpellObject);
        else abilityObjs.push(newSpellObject);
    }
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

function mouseWheel() {
    if (event.delta > 0) {
        if (camera.scaleTo > 0.5) camera.scaleTo -= camera.scaleTo / 10;
    } else {
        if (camera.scaleTo < 5) camera.scaleTo += camera.scaleTo / 10;
    }
}
