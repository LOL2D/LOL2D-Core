let p1, p2;
let camera;
let gamemap;
let input;
let abilityObjs = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    preventRightClick();
    textAlign(CENTER, CENTER);

    gamemap = new GameMap();
    camera = new Camera();
    input = new Input();

    p1 = new Ahri({
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

    p1.run();

    for (let i = abilityObjs.length - 1; i >= 0; i--) {
        abilityObjs[i].run();

        if (abilityObjs[i].checkFinished()) {
            abilityObjs.splice(i, 1);
        }
    }

    camera.endState();
}

// ----------- p5js input -----------
function keyPressed() {}
function keyReleased() {
    let newSpellObject = input.keyReleased(
        keyCode,
        camera.convert(mouseX, mouseY)
    );

    if (newSpellObject) abilityObjs.push(newSpellObject);
}
function keyTyped() {}

function mousePressed() {}
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
