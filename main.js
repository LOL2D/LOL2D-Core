let p1, p2;
let camera;
let gamemap;
let arr = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    preventRightClick();

    gamemap = new GameMap();
    camera = new Camera();

    p1 = new Champion({
        position: createVector(random(gamemap.width), random(gamemap.height)),
        bound: gamemap.getBound(),
    });
    p2 = new Champion({
        position: createVector(random(gamemap.width), random(gamemap.height)),
        bound: gamemap.getBound(),
    });

    camera.target = p1.position;

    for (let i = 0; i < 15; i++) {
        arr.push({ x: random(gamemap.width), y: random(gamemap.height) });
    }
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

    strokeWeight(0);
    fill("red");
    for (let a of arr) {
        circle(a.x, a.y, 20);
    }

    p1.run();
    p2.run();

    camera.endState();

    // show mouse cursor
    strokeWeight(10);
    stroke(150);
    line(mouseX, mouseY, pmouseX, pmouseY);
    strokeWeight(1);

    // show fps
    noStroke();
    fill("black");
    text("FPS: " + ~~frameRate(), 10, 10);
}

function keyPressed() {
    if (keyCode == 32) {
        camera.follow = !camera.follow;
    }
}

function mouseWheel(event) {
    // if (event.delta > 0) {
    //     if (camera.scaleTo > 0.5) camera.scaleTo -= camera.scaleTo / 10;
    // } else {
    //     if (camera.scaleTo < 5) camera.scaleTo += camera.scaleTo / 10;
    // }
}
