var buffer;
var circles = 10000;

function setup() {
    createCanvas(400, 400);
    buffer = createGraphics(width, height);
    makeCircleBuffer();
}

function draw() {
    if (mouseIsPressed) {
        image(buffer, 0, 0);
    } else {
        drawCircles();
    }

    textSize(36);
    text(frameRate(), 50, height / 2);
}

function drawCircles() {
    randomSeed(0);
    for (var i = 0; i < circles; i++) {
        ellipse(random(width), random(height), 20, 20);
    }
}

function makeCircleBuffer() {
    randomSeed(1);
    for (var i = 0; i < circles; i++) {
        buffer.ellipse(random(width), random(height), 20, 20);
    }
}
