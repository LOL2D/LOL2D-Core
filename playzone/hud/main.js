function setup() {
    createCanvas(windowWidth, windowHeight)
        .position(0, 0)
        .parent("canvas-container");

    textSize(30);
    textAlign(CENTER, CENTER);
    fill("white");
}

function draw() {
    background(30);

    text(
        "Không dùng html để render HUD nữa, render bằng p5js luôn!!\nAi giỏi css html làm dùm thì xin cám ơn :)))",
        width * 0.5,
        height * 0.5
    );
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
}
