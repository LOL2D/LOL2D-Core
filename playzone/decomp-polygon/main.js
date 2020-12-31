// https://github.com/schteppe/poly-decomp.js/

let path = [];
let polys = [];
let spacing = 30;
let colors = ["#f99", "#9f9", "#99f", "#ff9"];

function setup() {
    createCanvas(500, 500);

    strokeWeight(3);
}

function draw() {
    background(30);

    // ========== polygon ==========
    // shape
    stroke("gray");
    noFill();
    beginShape();
    for (let p of path) {
        vertex(p[0], p[1]);
    }
    endShape(CLOSE);

    // points
    fill("red");
    noStroke();
    for (let p of path) {
        circle(p[0], p[1], 10);
    }

    // ========== decomped polygon ==========
    for (let i = 0; i < polys.length; i++) {
        fill(colors[i % colors.length]);

        beginShape();
        for (let p of polys[i]) {
            vertex(p[0], p[1]);
        }
        endShape();
    }

    // hint
    fill("white");
    noStroke();
    text("Drag mouse to draw polygon", 10, 15);
}

function mousePressed() {
    // reset polygon
    path = [];
    polys = [];
}

function mouseReleased() {
    polys = decompPolygon(path);
}

function mouseDragged() {
    let canAddPoint = true;

    if (path.length > 0) {
        let lastPoint = path[path.length - 1];
        let d = dist(lastPoint[0], lastPoint[1], mouseX, mouseY);

        if (d < spacing) {
            canAddPoint = false;
        }
    }

    if (canAddPoint) {
        path.push([mouseX, mouseY]);
    }
}

function decompPolygon(_path) {
    if (_path.length < 3) return [];

    // Make sure the polygon has counter-clockwise winding. Skip this step if you know it's already counter-clockwise.
    decomp.makeCCW(_path);

    // Decompose into convex polygons, using the faster algorithm
    return decomp.quickDecomp(_path);
}
