const MODE = {
    EDITMAP: "map",
    EDITPOLYGON: "poly",
};

let mode = MODE.EDITPOLYGON;

// map edit
// map contains list of terrains, terrain contains list of polygons
let mapData = {
    terrainSelected: null,
    terrainHovered: null,
    pointSelected: null,
    pointHovered: null,

    camera: {
        x: 0,
        y: 0,
        scale: 1,
        xTo: 0,
        yTo: 0,
        scaleTo: 1,
    },

    dragDeltaMouse: [0, 0],

    terrains: [
        {
            name: "abc",
            position: [100, 100],
            polygon: [],
            polygons: [],
        },
    ],
};

function setup() {
    createCanvas(windowWidth, windowHeight).position(0, 0);
}

function draw() {
    background(30);

    updateCamera(mapData.camera);

    beginStateCamera(mapData.camera);

    // style
    textSize(14 / mapData.camera.scale);
    strokeWeight(1 / mapData.camera.scale);

    // draw grid
    drawGrid(mapData.camera);

    // draw polygons
    strokeWeight(3 / mapData.camera.scale);
    drawMap(mapData);

    // terrain selected
    if (mapData.terrainSelected) {
        let m = canvasToWorld([mouseX, mouseY], mapData.camera);
        mapData.terrainSelected.position[0] = m[0] + mapData.dragDeltaMouse[0];
        mapData.terrainSelected.position[1] = m[1] + mapData.dragDeltaMouse[1];

        let p = mapData.terrainSelected.position;
        let t = `[${~~p[0]},${~~p[1]}]`;
        stroke("#555");
        fill("yellow");
        text(t, m[0], m[1]);
    }

    // terrain hovered
    if (mapData.terrainHovered) {
        fill("#fff5");
        stroke("white");

        circle(
            mapData.terrainHovered.position[0],
            mapData.terrainHovered.position[1],
            100
        );
    }

    // point selected
    if (mapData.terrainSelected) {
        if (mapData.pointSelected) {
            let m = canvasToWorld([mouseX, mouseY], mapData.camera);
            mapData.pointSelected[0] = m[0] + mapData.dragDeltaMouse[0];
            mapData.pointSelected[1] = m[1] + mapData.dragDeltaMouse[1];

            let t = `[${~~m[0]},${~~m[1]}]`;
            stroke("#555");
            fill("yellow");
            text(t, m[0], m[1]);
        }

        // hight light hovered
        if (mapData.pointHovered) {
            noFill();
            stroke("yellow");
            circle(mapData.pointHovered[0], mapData.pointHovered[1], 10);
        }
    }

    endStateCamera();

    fill("white");
    text(~mapData.camera.x + "," + ~mapData.camera.y, 10, 10);
}

function mouseDragged() {
    if (!mapData.terrainSelected && !mapData.pointSelected) {
        mapData.camera.xTo -= movedX / mapData.camera.scale;
        mapData.camera.yTo -= movedY / mapData.camera.scale;
    }
}

function mouseMoved() {
    mapData.pointHovered = null;
    mapData.terrainHovered = null;

    let m = canvasToWorld([mouseX, mouseY], mapData.camera);

    // check hover terrain
    mapData.terrainHovered = getHoveredTerrain(m, mapData.terrains);

    // check hover points in terrain
    if (mapData.terrainSelected) {
        mapData.pointHovered = getHoveredPoint(
            m,
            mapData.terrainSelected.polygon
        );
    }
}

function mousePressed() {
    let m = canvasToWorld([mouseX, mouseY], mapData.camera);

    if (mapData.terrainHovered) {
        mapData.terrainSelected = mapData.terrainHovered;
        mapData.dragDeltaMouse = [
            mapData.terrainSelected.position[0] - m[0],
            mapData.terrainSelected.position[1] - m[1],
        ];
    }

    if (mapData.pointHovered) {
        mapData.pointSelected = mapData.pointHovered;
        mapData.dragDeltaMouse = [
            mapData.pointSelected.position[0] - m[0],
            mapData.pointSelected.position[1] - m[1],
        ];
    }
}

function mouseReleased() {
    mapData.pointSelected = null;
    mapData.terrainSelected = null;
}

function mouseWheel(event) {
    if (event.delta > 0) {
        if (mapData.camera.scaleTo > 0.01) {
            mapData.camera.scaleTo -= mapData.camera.scaleTo / 5;
            mapData.camera.xTo;
        }
    } else {
        if (mapData.camera.scaleTo < 10) {
            mapData.camera.scaleTo += mapData.camera.scaleTo / 5;
        }
    }
}

function keyPressed() {
    if (key == "a") {
        if (mapData.terrainSelected) {
            let m = canvasToWorld([mouseX, mouseY], mapData.camera);
            addPointToPoly(mapData.terrainSelected.polygon, m[0], m[1]);
        }
    }
    if (key == "c") {
        if (mapData.terrainSelected) {
            mapData.terrainSelected.polygon = [];
            mapData.terrainSelected.polygons = [];
        }
    }
    if (key == "d") {
        if (mapData.pointHovered) {
            deletePointFromPolygon(polygon, mapData.pointHovered);
            mapData.pointHovered = null;
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// ==================== util ===================
function getHoveredTerrain(m, terrains) {
    for (let terrain of terrains) {
        if (dist(m[0], m[1], terrain.position[0], terrain.position[1]) < 50) {
            return terrain;
        }
    }

    return null;
}

function getHoveredPoint(m, polygon) {
    for (let p of polygon) {
        if (dist(m[0], m[1], p[0], p[1]) < 10) {
            return p;
        }
    }

    return null;
}

// ===================== map ====================
function drawMap(_mapData) {
    for (let terrain of _mapData.terrains) {
        // position
        fill("red");
        circle(terrain.position[0], terrain.position[1], 20);

        // polygon
        drawPolygon(terrain.polygon);

        // polygons decomp
        if (
            _mapData.terrainHovered == terrain ||
            _mapData.terrainSelected == terrain
        ) {
            drawPolygonsColor(terrain.polygons);

            // decomp polygon
            if (terrain.polygon.length > 3)
                terrain.polygons = decompPolygon(terrain.polygon);
        }
    }
}

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
