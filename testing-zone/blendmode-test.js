// live preview: https://editor.p5js.org/HoangTran0410/sketches/7Dlqz7z77

let overlay;
let overlayColor = "#000d";
let groundColor = "green";
let champColor = "blue";
let fovRadius = 200;

function setup() {
    createCanvas(400, 400);
    overlay = createGraphics(400, 400);

    angleMode(DEGREES);
}

function draw() {
    // draw ground and player
    background(groundColor);
    fill(champColor);
    ellipse(width / 2, height / 2, 50);

    // magic here
    //usingBlendMode();
    usingErase();

    // show overlay on top of game
    image(overlay, 0, 0);
}

function usingErase() {
    // clear overlay with overlay color
    overlay.clear();
    overlay.background(overlayColor);

    // remove color at mouse
    overlay.erase();
    overlay.fill(255);
    overlay.ellipse(mouseX, mouseY, fovRadius);
    overlay.noErase();
}

function usingBlendMode() {
    // clear overlay with overlay color
    overlay.clear();
    overlay.blendMode(BLEND);
    overlay.background(overlayColor);

    // remove color at mouse
    overlay.blendMode(REMOVE);
    overlay.fill(255);
    overlay.ellipse(mouseX, mouseY, fovRadius);
}
