let cd = 1;
let cooldown = 3;

function setup() {
    createCanvas(400, 300);
    textSize(16);
}

function draw() {
    background(255);

    let b = {
        x: width * 0.5 - 50,
        y: height * 0.5 - 50,
        w: 100,
        h: 100,
    };

    if (cd > 0) cd -= 1 / 60;
    else cd = cooldown;

    // cooldown
    let h = ~~map(cd, cooldown, 0, b.h * 0.5, 0);
    fill("black");
    text(h, 10, 20);

    stroke("white");
    fill("#222d");

    let out = [
        [b.x, b.y],
        [b.x + b.w, b.y],
        [b.x + b.w, b.y + b.h],
        [b.x, b.y + b.h],
    ];

    let ins = [
        [b.x + h, b.y + b.h - h],
        [b.x + b.w - h, b.y + b.h - h],
        [b.x + b.w - h, b.y + h],
        [b.x + h, b.y + h],
    ];

    beginShape();
    for (let p of out) {
        vertex(p[0], p[1]);
    }

    beginContour();
    for (let p of ins) {
        vertex(p[0], p[1]);
    }
    endContour();

    endShape(CLOSE);

    fill("red");
    for (let p of out) {
        circle(p[0], p[1], 10);
    }

    fill("blue");
    for (let p of ins) {
        circle(p[0], p[1], 10);
    }
}
