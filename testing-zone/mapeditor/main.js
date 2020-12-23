const MODE = {
    EDITMAP: "map",
    EDITPOLYGON: "poly",
};

let mode = MODE.EDITPOLYGON;
let camera = {
    x: 0,
    y: 0,
    scale: 1,
    xTo: 0,
    yTo: 0,
    scaleTo: 1,
};

// map edit
// map contains list of terrains, terrain contains list of polygons
let map = [
    {
        name: "abc",
        position: [100, 100],
        polygon: [],
        polygons: [],
    },
];
let terrainSelected, terrainHovered;

// poly edit
let polygon = [];
let listDecompPoly = [];
let pointSelected, pointHovered;

function setup() {
    createCanvas(windowWidth, windowHeight).position(0, 0);
}

function draw() {
    background(30);

    updateCamera(camera);

    beginStateCamera(camera);

    // draw grid
    textSize(14 / camera.scale);
    strokeWeight(1 / camera.scale);
    drawGrid(camera);

    // draw polygons
    strokeWeight(3 / camera.scale);
    drawPolygon(polygon);
    drawPolygonsColor(listDecompPoly);

    if (polygon.length > 3) listDecompPoly = decompPolygon(polygon);

    // move selected
    if (pointSelected) {
        let m = canvasToWorld([mouseX, mouseY], camera);
        pointSelected[0] = m[0];
        pointSelected[1] = m[1];

        let t = `[${~~m[0]},${~~m[1]}]`;
        stroke("#555");
        fill("white");
        text(t, m[0], m[1]);
    }

    // hight light hovered
    if (pointHovered) {
        noFill();
        stroke("yellow");
        circle(pointHovered[0], pointHovered[1], 10);
    }

    endStateCamera();

    fill("white");
    text(~camera.x + "," + ~camera.y, 10, 10);
}

function mouseDragged() {
    if (!pointSelected) {
        camera.xTo -= movedX / camera.scale;
        camera.yTo -= movedY / camera.scale;
    }
}

function mouseMoved() {
    pointHovered = null;

    let m = canvasToWorld([mouseX, mouseY], camera);

    for (let p of polygon) {
        if (dist(m[0], m[1], p[0], p[1]) < 10) {
            pointHovered = p;
            break;
        }
    }
}

function mousePressed() {
    if (pointHovered) {
        pointSelected = pointHovered;
    }
}

function mouseReleased() {
    pointSelected = null;
}

function mouseWheel(event) {
    if (event.delta > 0) {
        if (camera.scaleTo > 0.01) camera.scaleTo -= camera.scaleTo / 5;
    } else {
        if (camera.scaleTo < 10) camera.scaleTo += camera.scaleTo / 5;
    }
}

function keyPressed() {
    if (key == "a") {
        let m = canvasToWorld([mouseX, mouseY], camera);
        addPointToPoly(polygon, m[0], m[1]);
    }
    if (key == "c") {
        listDecompPoly = [];
        polygon = [];
    }
    if (key == "d") {
        if (pointHovered) {
            deletePointFromPolygon(polygon, pointHovered);
            pointHovered = null;
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// ===================== map ====================
function drawMap(mapData) {}

// ====================== camera ======================
function updateCamera(cam) {
    cam.x = lerp(cam.x, cam.xTo, 0.2);
    cam.y = lerp(cam.y, cam.yTo, 0.2);
    cam.scale = lerp(cam.scale, cam.scaleTo, 0.2);
}

function canvasToWorld(pos, cam) {
    return [
        (pos[0] - width * 0.5) / cam.scale + cam.x,
        (pos[1] - height * 0.5) / cam.scale + cam.y,
    ];
}

function beginStateCamera(cam) {
    push();
    translate(width * 0.5, height * 0.5);
    scale(cam.scale);
    translate(-cam.x, -cam.y);
}

function endStateCamera() {
    pop();
}

// ===================== grid ========================
function drawGrid(cam) {
    let topleft = canvasToWorld([0, 0], cam);
    let bottomright = canvasToWorld([width, height], cam);

    let left = topleft[0];
    let top = topleft[1];
    let right = bottomright[0];
    let bottom = bottomright[1];

    // center line
    stroke("white");
    line(0, top, 0, bottom);
    line(left, 0, right, 0);

    // calculate grid size
    let gridSize = 50;
    while (gridSize * cam.scale < 100) {
        gridSize *= 2;
    }
    while (gridSize * cam.scale > 200) {
        gridSize = gridSize / 2;
    }

    // draw grid
    stroke("#5559");
    fill("white");
    let i;

    for (i = 0; i > left; i -= gridSize) {
        line(i, top, i, bottom);
        text(i, i, 0);
    }

    for (i = 0; i < right; i += gridSize) {
        line(i, top, i, bottom);
        text(i, i, 0);
    }

    for (i = 0; i > top; i -= gridSize) {
        line(left, i, right, i);
        text(i, 0, i);
    }

    for (i = 0; i < bottom; i += gridSize) {
        line(left, i, right, i);
        text(i, 0, i);
    }
}

// ======================= poly ========================
function addPointToPoly(poly, x, y) {
    poly.push([x, y]);
}

function deletePointFromPolygon(poly, point) {
    poly.splice(poly.indexOf(point), 1);
}

function drawPolygon(
    poly,
    isDrawIndex = true,
    fillColor = "#0000",
    dotColor = "red"
) {
    stroke("white");
    fill(fillColor);

    // shape
    beginShape();
    for (let p of poly) {
        vertex(p[0], p[1]);
    }
    endShape(CLOSE);

    // points
    noStroke();
    fill(dotColor);
    for (let p of poly) {
        circle(p[0], p[1], 10);
    }

    // index
    if (isDrawIndex) {
        noStroke();
        fill("white");
        let index = 0;
        for (let p of poly) {
            text(index, p[0], p[1] - 10);
            index++;
        }
    }
}

function drawPolygonsColor(listPolygons, listColors) {
    let c = listColors || [
        "#0f05",
        "#00f5",
        "#f005",
        "#ff05",
        "#fff5",
        "#0ff5",
    ];

    let colorIndex = 0;
    for (let poly of listPolygons) {
        drawPolygon(poly, false, c[colorIndex]);
        colorIndex++;

        if (colorIndex >= c.length) colorIndex = 0;
    }
}

// =============== decomp polygon ================
function decompPolygon(poly) {
    if (poly.length < 3) return;

    // Make sure the polygon has counter-clockwise winding. Skip this step if you know it's already counter-clockwise.
    decomp.makeCCW(poly);

    // Decompose into convex polygons, using the faster algorithm
    return decomp.quickDecomp(poly);
}
