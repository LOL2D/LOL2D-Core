const MODE = {
    EDITMAP: "map",
    EDITPOLYGON: "poly",
};

let mode = MODE.EDITPOLYGON;

// map edit
let editor = {
    terrainDragged: null,
    terrainSelected: null,
    terrainHovered: null,
    pointSelected: null,
    pointHovered: null,

    mouse: [0, 0],

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
            polygon: [
                [-50, -50],
                [50, -50],
                [50, 50],
                [-50, 50],
            ],
            polygons: [],
        },
        {
            name: "bcd",
            position: [200, 100],
            polygon: [
                [-50, -50],
                [50, -50],
                [50, 50],
                [-50, 50],
            ],
            polygons: [],
        },
    ],
};

function setup() {
    createCanvas(800, 600).parent("canvasWrapper");
    textFont("monospace");
}

function draw() {
    background(30);

    updateCamera(editor.camera);
    beginStateCamera(editor.camera);

    // mouse
    editor.mouse = canvasToWorld([mouseX, mouseY], editor.camera);

    // style
    textSize(14 / editor.camera.scale);
    strokeWeight(1 / editor.camera.scale);

    // draw grid
    drawGrid(editor.camera);

    // draw polygons
    strokeWeight(3 / editor.camera.scale);
    drawMap(editor);

    endStateCamera();

    fill("white");
    text(~editor.camera.x + "," + ~editor.camera.y, 10, 10);
}

function mouseDragged() {
    if (!editor.terrainDragged && !editor.pointSelected) {
        editor.camera.xTo -= movedX / editor.camera.scale;
        editor.camera.yTo -= movedY / editor.camera.scale;
    }
}

function mouseMoved() {
    editor.pointHovered = null;
    editor.terrainHovered = null;

    // check hover terrain
    editor.terrainHovered = getHoveredTerrain(editor.mouse, editor.terrains);

    // check hover points in terrain
    if (editor.terrainSelected) {
        editor.pointHovered = getHoveredPoint(
            editor.mouse,
            editor.terrainSelected
        );
    }
}

function mousePressed() {
    if (editor.terrainSelected) {
        if (editor.pointHovered) {
            editor.pointSelected = editor.pointHovered;
            editor.dragDeltaMouse = [0, 0];
        } else {
            let pressedTerrain = getHoveredTerrain(
                editor.mouse,
                editor.terrains
            );
            if (pressedTerrain) {
                if (pressedTerrain != editor.terrainSelected) {
                    editor.terrainSelected = pressedTerrain;
                } else {
                    editor.terrainDragged = editor.terrainSelected;
                }
            }
        }
    }

    if (!editor.pointHovered && editor.terrainHovered) {
        editor.terrainSelected = editor.terrainHovered;
        editor.dragDeltaMouse = [
            editor.terrainSelected.position[0] - editor.mouse[0],
            editor.terrainSelected.position[1] - editor.mouse[1],
        ];
    }
}

function mouseReleased() {
    editor.pointSelected = null;
    editor.terrainDragged = null;
}

function mouseWheel(event) {
    if (event.delta > 0) {
        if (editor.camera.scaleTo > 0.01) {
            editor.camera.scaleTo -= editor.camera.scaleTo / 5;
        }
    } else {
        if (editor.camera.scaleTo < 10) {
            editor.camera.scaleTo += editor.camera.scaleTo / 5;
        }
    }
}

function keyPressed() {
    if (key == "a") {
        if (editor.terrainSelected) {
            editor.mouse[0] -= editor.terrainSelected.position[0];
            editor.mouse[1] -= editor.terrainSelected.position[1];

            addPointToPoly(
                editor.terrainSelected.polygon,
                editor.mouse[0],
                editor.mouse[1]
            );
        }
    }
    if (key == "c") {
        if (editor.terrainSelected) {
            editor.terrainSelected.polygon = [];
            editor.terrainSelected.polygons = [];
        }
    }
    if (key == "d") {
        if (editor.pointHovered) {
            deletePointFromPolygon(polygon, editor.pointHovered);
            editor.pointHovered = null;
        }
    }
}

// ===================== map ====================
function drawMap(_editor) {
    for (let terrain of _editor.terrains) {
        // flag
        let isHovered = _editor.terrainHovered == terrain;
        let isSelected = _editor.terrainSelected == terrain;

        // position
        if (isHovered || isSelected) {
            stroke("yellow");
            noFill();
            circle(terrain.position[0], terrain.position[1], 20);
        }

        // polygon
        drawTerrain(terrain.polygon, terrain.position);

        // polygons
        if (isHovered || isSelected) {
            drawTerrainColor(terrain.polygons, terrain.position, isSelected);

            // decomp polygon
            if (terrain.polygon.length > 3) {
                terrain.polygons = decompPolygon(terrain.polygon);
            }
        }
    }

    // terrain dragged
    if (_editor.terrainDragged) {
        _editor.terrainDragged.position[0] =
            _editor.mouse[0] + _editor.dragDeltaMouse[0];
        _editor.terrainDragged.position[1] =
            _editor.mouse[1] + _editor.dragDeltaMouse[1];

        let p = _editor.terrainDragged.position;
        let t = `[${~~p[0]},${~~p[1]}]`;
        stroke("#555");
        fill("yellow");
        text(t, p[0], p[1]);
    }

    // terrain selected
    // if (_editor.terrainSelected) {
    // }

    // terrain hovered
    // if (_editor.terrainHovered) {
    // }

    // terrain selected
    if (_editor.terrainSelected) {
        if (_editor.pointSelected) {
            _editor.pointSelected[0] =
                _editor.mouse[0] +
                _editor.dragDeltaMouse[0] -
                _editor.terrainSelected.position[0];
            _editor.pointSelected[1] =
                _editor.mouse[1] +
                _editor.dragDeltaMouse[1] -
                _editor.terrainSelected.position[1];
        }

        // hight light hovered
        if (_editor.pointHovered) {
            let realPosHover = [
                _editor.terrainSelected.position[0] + _editor.pointHovered[0],
                _editor.terrainSelected.position[1] + _editor.pointHovered[1],
            ];
            noFill();
            stroke("yellow");
            circle(realPosHover[0], realPosHover[1], 10);
        }
    }
}

// =============== UI ===================
function addTerrain() {
    editor.terrains.push({
        name: "abc",
        position: [editor.camera.x, editor.camera.y],
        polygon: [
            [-50, -50],
            [50, -50],
            [50, 50],
            [-50, 50],
        ],
        polygons: [],
    });
}

function deleteSelectedTerrain() {
    if (editor.terrainSelected) {
        Swal.fire({
            icon: "warning",
            title: "Xóa polygon",
            text: "Bạn có chắc muốn xóa polygon đang chọn?",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTerrain(editor.terrainSelected, editor.terrains);
            }
        });
    } else {
        Swal.fire({
            icon: "info",
            title: "Lỗi",
            text: "Chưa chọn polygon nào để xóa.",
        });
    }
}
function huongdan() {
    Swal.fire({
        title: "Hướng dẫn",
        width: "100%",
        html: `
        <div style="text-align: left">
            Map có nhiều vật thể có hình polygon (gọi là <b>terrain</b>) <br/>
            Mỗi terrain(polygon) được tạo từ nhiều <b>đỉnh</b> <br/>

            <ul>
                <li>Click chuột vào 1 terrain để bắt đầu chỉnh sửa nó </li>
                <li>
                    Terrain đang được chọn cho phép:
                    <ul>   
                        <li>di chuyển vị trí (kéo thả phần bên trong terrain)</li>
                        <li>di chuyển các đỉnh (kéo thả đỉnh)</li>
                    </ul>
                </li>
            </ul>

            Phím tắt:
            <ul>
                <li>A: (add) thêm đỉnh vào terrain đang chọn tại vị trí con trỏ</li>
                <li>D: (delete) xóa đỉnh (của terrain đang chọn) tại vị trí con trỏ</li>
                <li>C: (clear) xóa hết đỉnh của terrain đang chọn</li>
                <li></li>
            </ul>
        </div>
    `,
    });
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
    fill("#9995");
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
function drawTerrain(
    poly,
    offset = [0, 0],
    isDrawDots = false,
    fillColor = "#0000"
) {
    stroke("white");
    fill(fillColor);

    // shape
    beginShape();
    for (let p of poly) {
        vertex(p[0] + offset[0], p[1] + offset[1]);
    }
    endShape(CLOSE);

    // points
    if (isDrawDots) {
        // points
        noStroke();
        fill("#f009");
        for (let p of poly) {
            circle(p[0] + offset[0], p[1] + offset[1], 10);
        }

        // index
        noStroke();
        fill("white");
        let index = 0;
        for (let p of poly) {
            text(index, p[0] + offset[0], p[1] + offset[1] - 10);
            index++;
        }
    }
}
function drawTerrainColor(listPolygons, offset, hightlight) {
    let c = ["#fff5", "#0f05", "#00f5", "#f005", "#ff05", "#0ff5"];

    let colorIndex = 0;
    for (let poly of listPolygons) {
        drawTerrain(poly, offset, hightlight, c[colorIndex]);
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

// ==================== util ===================
function getHoveredTerrain(m, terrains) {
    for (let terrain of terrains) {
        let SATvertices = terrain.polygon.map(
            (point) =>
                new SAT.Vector(
                    point[0] + terrain.position[0],
                    point[1] + terrain.position[1]
                )
        );

        let collided = isMouseInPoly(m, SATvertices);

        if (collided) return terrain;
    }

    return null;
}
function isMouseInPoly(m, SATvertices) {
    let SATpolygon = new SAT.Polygon(new SAT.Vector(), SATvertices);
    let collided = SAT.pointInPolygon(new SAT.Vector(m[0], m[1]), SATpolygon);

    return collided;
}
function getHoveredPoint(m, terrain) {
    let pos = terrain.position;

    for (let p of terrain.polygon) {
        if (dist(m[0], m[1], p[0] + pos[0], p[1] + pos[1]) < 10) {
            return p;
        }
    }

    return null;
}

function deleteTerrain(terrain, listTerrains) {
    listTerrains.splice(listTerrains.indexOf(terrain), 1);
}
