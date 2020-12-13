let camera;
let gamemap;
let input;

let abilityObjs = [];
let listChampions = [];
let myChamp;

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    Utils.preventRightClick();

    // core
    gamemap = new GameMapCore();
    camera = new CameraCore();
    input = new InputCore();

    // players
    myChamp = new Ahri({
        bound: gamemap.getBound(),
    });
    listChampions.push(myChamp);

    for (let i = 0; i < 4; i++) {
        listChampions.push(
            new Ahri({
                position: createVector(random(1000), random(1000)),
                bound: gamemap.getBound(),
            })
        );
    }

    // set
    camera.target = myChamp.position;
    input.champion = myChamp;
}

function draw() {
    background(30);

    // control by mouse
    if (mouseIsPressed) {
        if (mouseButton == RIGHT) {
            let worldPos = camera.convert(mouseX, mouseY);
            myChamp.moveTo(worldPos.x, worldPos.y);
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
    for (let champ of listChampions) {
        champ.run();
    }

    // ability objects
    for (let i = abilityObjs.length - 1; i >= 0; i--) {
        abilityObjs[i].run();

        // effect
        abilityObjs[i].effectChampions(listChampions);

        // check finish
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
}
