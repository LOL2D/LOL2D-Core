// live preview: https://editor.p5js.org/HoangTran0410/sketches/7Dlqz7z77

let overlay;
let overlayColor = "#333d";
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

    // clear overlay with overlay color
    overlay.blendMode(BLEND);
    overlay.background(overlayColor);

    // remove color at mouse
    overlay.blendMode(REMOVE);
    overlay.fill(255);
    overlay.ellipse(mouseX, mouseY, fovRadius);

    // show overlay on top of game
    image(overlay, 0, 0);
}
