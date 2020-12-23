let originalPoly = [];
let convexPolygons = [];
let img;
let gui;

let colors = ["#f005", "#ff05", "#fff5", "#0f05", "#0ff5", "#00f5"];

let GUI = {
    minEdgeLength: 50,
    drawMode: "keyboard",
    decompPoly,
    clearPoly,
    exportData,
};

function preload() {
    img = loadImage("./asset/bird.png");
}

function setup() {
    createCanvas(800, 600);
    textAlign(CENTER, CENTER);
    strokeCap(ROUND);

    gui = new dat.GUI();

    gui.add(GUI, "minEdgeLength").min(20).max(200).step(1);
    gui.add(GUI, "drawMode", { mouse: "mouse", keyboard: "keyboard" });

    gui.add(GUI, "decompPoly").name("Decompoly");
    gui.add(GUI, "clearPoly").name("Clear");
    gui.add(GUI, "exportData");
    // gui.add(window, )
}

function draw() {
    background(30);

    image(img, 0, 0);

    drawPoly(originalPoly);

    drawMultiplePoly(convexPolygons, colors);

    if (GUI.drawMode == "keyboard" && originalPoly.length) {
        let last = originalPoly[originalPoly.length - 1];

        stroke("#fff9");
        strokeWeight(2);
        line(mouseX, mouseY, last[0], last[1]);
    }
}

function mouseDragged() {
    if (mouseButton == LEFT && GUI.drawMode == "mouse") makePoly();
}

function keyPressed() {
    if (GUI.drawMode == "keyboard") {
        if (key == "a") {
            originalPoly.push([mouseX, mouseY]);
        } else if (key == "u") {
            originalPoly.pop();
        }
    }
}

function makePoly() {
    let last = originalPoly[originalPoly.length - 1];

    if (!last || dist(mouseX, mouseY, last[0], last[1]) > GUI.minEdgeLength) {
        originalPoly.push([mouseX, mouseY]);
    }
}

function drawPoly(poly, fillColor = "#0000") {
    stroke("white");
    strokeWeight(3);
    fill(fillColor);
    beginShape();
    for (let p of poly) {
        vertex(p[0], p[1]);
    }
    // endShape(mouseIsPressed ? OPEN : CLOSE);
    endShape(CLOSE);

    noStroke();
    fill("red");
    for (let p of poly) {
        circle(p[0], p[1], 10);
    }
}

function drawMultiplePoly(listPoly, listColors) {
    let colorIndex = 0;
    for (let poly of listPoly) {
        drawPoly(poly, listColors[colorIndex]);

        colorIndex++;
        if (colorIndex >= listColors.length) {
            colorIndex = 0;
        }
    }
}

// ======================= gui ===================
function decompPoly() {
    if (originalPoly.length < 3) return;

    // Make sure the polygon has counter-clockwise winding. Skip this step if you know it's already counter-clockwise.
    decomp.makeCCW(originalPoly);

    // Decompose into convex polygons, using the faster algorithm
    convexPolygons = decomp.quickDecomp(originalPoly);

    console.log(convexPolygons);
}

function clearPoly() {
    originalPoly = [];
    convexPolygons = [];
}

function exportData() {
    window.prompt("Data:", JSON.stringify(convexPolygons));
}
