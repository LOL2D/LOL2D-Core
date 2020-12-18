// live preview: https://editor.p5js.org/HoangTran0410/sketches/7Dlqz7z77

let overlay;
let overlayColor = "#000e";
let groundColor = "#1af";
let champColor = "blue";
let fovRadius = 250;
let useBlendMode = false;
let things = [];

function setup() {
    createCanvas(600, 600);
    overlay = createGraphics(600, 600);
    overlay.noStroke();

    angleMode(DEGREES);

    for (let i = 0; i < 15; i++) {
        things.push({
            pos: createVector(random(width), random(height)),
            vel: createVector(random(-3, 3), random(-3, 3)),
            color: [random(255), random(255), random(255)],
            r: random(10, 50),
        });
    }
}

function draw() {
    if (useBlendMode) {
        drawUseBlendMode();
    } else {
        drawUseErase();
    }
}

function mousePressed() {
    useBlendMode = !useBlendMode;
}

// ---------------- ERASE -----------------
function drawUseErase() {
    // draw ground and things
    background(groundColor);
    drawThings();

    // clear overlay with overlay color
    overlay.clear();
    overlay.background(overlayColor);

    // magic here
    fovUsingErase(mouseX, mouseY, fovRadius);
    fovUsingErase(width / 2, height / 2, fovRadius);

    // show overlay on top of ground
    image(overlay, 0, 0);

    // show fps
    fill("white");
    text("click to switch mode", 10, height - 15);
    text("FPS: " + ~~frameRate() + " - ERASE", 10, 15);
}

function fovUsingErase(x, y, d) {
    overlay.erase();
    overlay.fill(255);
  
    radialGradient(x, y, d / 2 - 50, d / 2, "#FFF", "#0001");
    overlay.ellipse(x, y, d);
    overlay.noErase();
}

// ---------------- BLEND MODE -----------------
function drawUseBlendMode() {
    // draw ground and things
    background(groundColor);
    drawThings();

    // clear overlay with overlay color
    overlay.clear();
    overlay.blendMode(BLEND);
    overlay.background(overlayColor);

    // magic here
    fovUsingBlendMode(mouseX, mouseY, fovRadius);
    fovUsingBlendMode(width / 2, height / 2, fovRadius);

    // show overlay on top of ground
    image(overlay, 0, 0);

    // show fps
    fill("white");
    text("click to switch mode", 10, height - 15);
    text("FPS: " + ~~frameRate() + " - BLEND MODE", 10, 15);
}

function fovUsingBlendMode(x, y, d) {
    overlay.blendMode(REMOVE);
    //overlay.fill(255);
    radialGradient(x, y, d / 2 - 50, d / 2, "#FFF", "#0001");
    overlay.ellipse(x, y, d);
    overlay.blendMode(BLEND);
}

// -------------- HELPER ---------------
function radialGradient(x, y, r1, r2, c1, c2) {
    let grd = overlay.drawingContext.createRadialGradient(x, y, r1, x, y, r2);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    overlay.drawingContext.fillStyle = grd;
}

function drawThings() {
    stroke(30);
    strokeWeight(2);

    for (let t of things) {
        fill(t.color);
        ellipse(t.pos.x, t.pos.y, t.r * 2);

        t.pos.add(t.vel);

        if (t.pos.x < 0 || t.pos.x > width) t.vel.x *= -1;
        if (t.pos.y < 0 || t.pos.y > height) t.vel.y *= -1;

        t.pos.x = constrain(t.pos.x, 0, width);
        t.pos.y = constrain(t.pos.y, 0, height);
    }
}

// -------------- TEST ------------------
// overlay.fill(255, 50);
// overlay.ellipse(x, y, d);
// overlay.ellipse(x, y, d / 1.25);
// overlay.ellipse(x, y, d / 1.5);
// overlay.ellipse(x, y, d / 1.75);
// overlay.ellipse(x, y, d / 2);
