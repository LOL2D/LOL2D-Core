let connectedToFirebase = false;
let username = "";
let onlines = [];

// map editor
let editor = {
    dummy: { img: null, r: 60 },
    isShowDummy: false,

    isShowRealmap: false,
    isShowMinimap: false,
    realMapImg: null,

    minimap: null,
    minimapSize: [300, 300],

    mapSize: [6400, 6400],

    terrainDragged: null,
    terrainSelected: null,
    terrainHovered: null,
    pointSelected: null,
    pointHovered: null,

    mouse: [0, 0],
    dragDeltaMouse: [0, 0],

    camera: {
        x: 0,
        y: 0,
        scale: 1,
        xTo: 0,
        yTo: 0,
        scaleTo: 1,
    },

    terrains: [],
};

function preload() {
    editor.dummy.img = loadImage("asset/dummy.png");
    editor.realMapImg = loadImage("asset/full-minimap.png");
}

function setup() {
    createCanvas(1000, 600).parent("canvasWrapper");
    imageMode(CENTER);
    textFont("monospace");
    strokeCap(ROUND);

    editor.minimap = createGraphics(
        editor.minimapSize[0],
        editor.minimapSize[0]
    );

    resetEditorCamera();
    askName();
}

function draw() {
    background(30);

    updateCamera(editor.camera);
    beginStateCamera(editor.camera);

    // mouse
    editor.mouse = canvasToWorld([mouseX, mouseY], editor.camera);

    // real map
    drawRealMap();

    // style
    textSize(14 / editor.camera.scale);
    strokeWeight(1 / editor.camera.scale);

    // draw grid
    drawGrid(editor.camera);

    // draw polygons
    strokeWeight(3 / editor.camera.scale);
    drawMap(editor);

    endStateCamera();

    drawMinimap();

    fill("#fff9");
    text(~~editor.camera.x + "," + ~~editor.camera.y, 10, 10);
}

function mouseDragged(e) {
    if (!isMouseInCanvas(e)) return;

    if (!editor.terrainDragged && !editor.pointSelected) {
        editor.camera.xTo -= movedX / editor.camera.scale;
        editor.camera.yTo -= movedY / editor.camera.scale;
    }
}

function mouseMoved(e) {
    if (!isMouseInCanvas(e)) return;

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

function mousePressed(e) {
    if (!isMouseInCanvas(e)) return;

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

function mouseReleased(e) {
    if (!isMouseInCanvas(e)) return;

    if (editor.terrainSelected) {
        updateTerrainFirebase(editor.terrainSelected);
    }

    editor.pointSelected = null;
    editor.terrainDragged = null;
}

function mouseWheel(e) {
    if (!isMouseInCanvas(e)) return;

    if (e.delta > 0) {
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
            // calculate position to add
            let pos = [
                editor.mouse[0] - editor.terrainSelected.position[0],
                editor.mouse[1] - editor.terrainSelected.position[1],
            ];

            // add point to that position
            addPointToPoly(editor.terrainSelected.polygon, pos[0], pos[1]);

            // decomp polygons
            editor.terrainSelected.polygons = decompPolygon(
                editor.terrainSelected.polygon
            );

            // save to firebase
            updateTerrainFirebase(editor.terrainSelected);
        }
    }
    if (key == "d") {
        if (editor.pointHovered) {
            // delete point
            deletePointFromPolygon(
                editor.terrainSelected.polygon,
                editor.pointHovered
            );

            // decomp polygons
            editor.terrainSelected.polygons = decompPolygon(
                editor.terrainSelected.polygon
            );

            editor.pointHovered = null;

            // save to firebase
            updateTerrainFirebase(editor.terrainSelected);
        }
    }
}

// =================== real map ================
function setShowRealMap(value) {
    editor.isShowRealmap = value;
}
function setShowMinimap(value) {
    editor.isShowMinimap = value;
}
function changeAsset(select) {
    editor.realMapImg = loadImage("asset/" + select.value);
}
function drawMinimap() {
    if (editor.isShowMinimap && editor.realMapImg) {
        let size = editor.minimapSize;

        editor.minimap.background(10);

        editor.minimap.push();
        editor.minimap.translate(size[0] * 0.5, size[1] * 0.5);
        editor.minimap.scale(editor.camera.scale);
        editor.minimap.translate(-editor.camera.x, -editor.camera.y);

        editor.minimap.image(
            editor.realMapImg,
            0,
            0,
            editor.mapSize[0],
            editor.mapSize[1]
        );

        editor.minimap.pop();

        image(editor.minimap, width - size[0] / 2, height - size[1] / 2);

        stroke("blue");
        noFill();
        rect(
            width / 2 - size[0] / 2,
            height / 2 - size[1] / 2,
            size[0],
            size[1]
        );
    }
}
function drawRealMap() {
    if (editor.isShowRealmap && editor.realMapImg) {
        image(
            editor.realMapImg,
            editor.mapSize[0] / 2,
            editor.mapSize[1] / 2,
            editor.mapSize[0],
            editor.mapSize[1]
        );

        // fill("#3335");
        // noStroke();
        // rect(0, 0, editor.mapSize[0], editor.mapSize[1]);
    }
}

// ===================== map ====================
function drawMap(_editor) {
    // show terrains
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
        drawTerrain(terrain.polygon, terrain.position, isSelected, isSelected);

        // polygons
        if (isHovered || isSelected) {
            drawTerrainColor(terrain.polygons, terrain.position, isSelected);
        }

        // decomp polygon
        if (isSelected && terrain.polygon.length > 3) {
            terrain.polygons = decompPolygon(terrain.polygon);
        }
    }

    // show dummy
    if (editor.isShowDummy) {
        image(
            editor.dummy.img,
            editor.camera.x,
            editor.camera.y,
            editor.dummy.r,
            editor.dummy.r
        );
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
function setShowDummy(_isShowDummy) {
    editor.isShowDummy = _isShowDummy;
}

// =============== firebase ================
/*
    {
        id: "0",
        position: "[100, 100]",
        polygon: "[[-50, -50], [50, -50], [50, 50], [-50, 50]]",
        polygons: "[]",
    },
 */
function askName() {
    let localUserName = localStorage.getItem("lol-mapeditor-2-username");

    Swal.fire({
        title: "Tên của bạn",
        text: "Điền tên của bạn để mọi người thấy được công việc bạn đang làm",
        input: "text",
        inputValue: localUserName,
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((resultName) => {
        if (resultName.isConfirmed && resultName.value != "") {
            username = resultName.value;
            localStorage.setItem("lol-mapeditor-2-username", username);

            connectFirebase(username);
        } else {
            askName();
        }
    });
}
function connectFirebase(_username) {
    Swal.fire({
        icon: "info",
        title: "Đang lấy dữ liệu..",
        text: "Đang lấy dữ liệu từ firebase",
        width: "100%",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    initFireBase();

    // connect with username
    addDataFirebase("onlines/" + _username, getFormattedDate());

    addDataFirebase("history/" + getFormattedDate(), "join:" + _username);
    window.addEventListener("beforeunload", function (e) {
        addDataFirebase("history/" + getFormattedDate(), "left:" + _username);
        removeDataFirebase("onlines/", _username);
    });

    // listen events
    listenToFireBase("onlines/", (data) => {
        onlines = data;
    });
    listenToFireBase("terrains/", (data) => {
        // hide loading
        if (!connectedToFirebase) {
            console.log("connected");

            connectedToFirebase = true;
            Swal.hideLoading();
            Swal.close();
        }

        // get terrains data
        let terrainArr = [];
        for (let key in data) {
            terrainArr.push({
                id: data[key].id,
                position: JSON.parse(data[key].position),
                polygon: JSON.parse(data[key].polygon),
                polygons: JSON.parse(data[key].polygons),
            });
        }
        editor.terrains = terrainArr;

        // re select terrain
        if (editor.terrainSelected) {
            for (let terrain of editor.terrains) {
                if (editor.terrainSelected.id == terrain.id) {
                    editor.terrainSelected = terrain;
                    break;
                }
            }
        }
    });
}
function deleteTerrainFirebase(terrain) {
    console.log(terrain);
    removeDataFirebase("terrains/", terrain.id);
}
function addTerrainFirebase(terrain) {
    addDataFirebase("terrains/" + terrain.id, terrain, (error) => {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi khi lưu polygon mới vào firebase. " + error,
        });
    });
}
function updateTerrainFirebase(terrain) {
    // chuyển về int
    let positionData = terrain.position.map((value) => ~~value);
    let polygonData = terrain.polygon.map((point) => [~~point[0], ~~point[1]]);
    let polygonsData = terrain.polygons.map((poly) => {
        let result = [];
        for (let point of poly) {
            result.push([~~point[0], ~~point[1]]);
        }
        return result;
    });

    // chuyển về json
    let data = {
        id: terrain.id,
        position: JSON.stringify(positionData),
        polygon: JSON.stringify(polygonData),
        polygons: JSON.stringify(polygonsData),
    };

    // update
    updateDataFirebase("terrains/" + data.id, data);
}

// =============== UI ===================
function addTerrain() {
    Swal.fire({
        icon: "info",
        title: "Thêm polygon",
        text: "Bạn muốn tạo Polygon có mấy đỉnh",
        input: "number",
        inputValue: 4,
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            let count = result.value;
            let angle = TWO_PI / count;
            let radius = 50;

            // https://p5js.org/examples/form-regular-polygon.html
            let polygon = [];
            for (let a = 0; a < TWO_PI; a += angle) {
                let sx = cos(a) * radius;
                let sy = sin(a) * radius;
                polygon.push([~~sx, ~~sy]);
            }

            let newTerrain = {
                id: generateNewKeyFirebase("terrains/"),
                position: `[${editor.camera.x}, ${editor.camera.y}]`,
                polygon: JSON.stringify(polygon), //"[[-50, -50],[50, -50],[50, 50],[-50, 50]]",
                polygons: "[]",
            };
            // editor.terrains.push(newTerrain); // khong can
            editor.terrainSelected = newTerrain;

            addTerrainFirebase(newTerrain);
        }
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
                deleteTerrainFirebase(editor.terrainSelected);
                editor.terrainSelected = null;
                // deleteTerrain(editor.terrainSelected, editor.terrains); // không cần xóa nữa, firebase sẽ đồng bộ
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
function rotateSelectedTerrain() {
    if (editor.terrainSelected) {
        Swal.fire({
            icon: "warning",
            title: "Xoay polygon",
            text: "Nhập vào góc muốn xoay (0-360, chiều kim đồng hồ)",
            input: "number",
            inputLabel: "Góc",
            showCancelButton: true,
            confirmButtonText: "Xoay",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                for (let point of editor.terrainSelected.polygon) {
                    let vec = createVector(point[0], point[1]);
                    vec.rotate(radians(result.value));

                    point[0] = round(vec.x);
                    point[1] = round(vec.y);
                }

                updateTerrainFirebase(editor.terrainSelected);
            }
        });
    } else {
        Swal.fire({
            icon: "info",
            title: "Lỗi",
            text: "Chưa chọn polygon nào để xoay.",
        });
    }
}
function cloneSelectedTerrain() {
    if (editor.terrainSelected) {
        // clone
        let newTerrain = JSON.parse(JSON.stringify(editor.terrainSelected));

        // modify
        newTerrain.id = generateNewKeyFirebase("terrains/");
        newTerrain.position = JSON.stringify([
            round(editor.camera.x),
            round(editor.camera.y),
        ]);
        newTerrain.polygon = JSON.stringify(newTerrain.polygon);
        newTerrain.polygons = JSON.stringify(newTerrain.polygons);

        addTerrainFirebase(newTerrain);

        console.log(newTerrain);
    } else {
        Swal.fire({
            icon: "info",
            title: "Lỗi",
            text: "Chưa chọn polygon nào để clone.",
        });
    }
}
function exportMapDataMinified() {
    let polygonsData = [];
    for (let terrain of editor.terrains) {
        for (let poly of terrain.polygons) {
            let polyData = [];
            for (let point of poly) {
                polyData.push([
                    point[0] + terrain.position[0],
                    point[1] + terrain.position[1],
                ]);
            }
            polygonsData.push(polyData);
        }
    }
    // console.log(JSON.stringify(polygonsData));

    Swal.fire({
        title: "Export map data",
        input: "textarea",
        inputLabel: "Dữ liệu json",
        inputValue: `{"data": ${JSON.stringify(polygonsData)}}`,
    });
}
function exportMapDataFull() {
    Swal.fire({
        title: "Export map data",
        input: "textarea",
        inputLabel: "Dữ liệu json",
        inputValue: `{"data": ${JSON.stringify(editor.terrains)}}`,
    });
}
function resetEditorCamera() {
    editor.camera.xTo = editor.mapSize[0] / 2;
    editor.camera.yTo = editor.mapSize[1] / 2;
    editor.camera.scaleTo =
        height / (editor.mapSize[0] + editor.mapSize[0] / 10);
}
function huongdan() {
    Swal.fire({
        title: "Hướng dẫn",
        width: "100%",
        html: `
        <div style="text-align: left">
            Map có nhiều vật thể có hình polygon (gọi là <u>terrain</u>) <br/>
            Mỗi terrain(polygon) được tạo từ nhiều <u>đỉnh</u> <br/><br/>

            <u>Click chuột</u> vào 1 polygon để bắt đầu chỉnh sửa nó.<br/>
            <u>Sử dụng chuột</u> với polygon được chọn:
            <ul>   
                <li>di chuyển vị trí (kéo thả phần bên trong terrain)</li>
                <li>di chuyển các đỉnh (kéo thả đỉnh)</li>
            </ul>

            <u>Phím tắt</u> với polygon được chọn:
            <ul>
                <li>A: (add) thêm đỉnh vào terrain đang chọn tại vị trí con trỏ</li>
                <li>D: (delete) xóa đỉnh (của terrain đang chọn) tại vị trí con trỏ</li>
            </ul>

            <u>Các nút chức năng:</u>
            <ul>
                <li><u>Reset camera</u>: Đưa camera về trạng thái ban đầu (vị trí 0,0 thu phóng 1)</li>
                <li><u>Thêm poly</u>: Thêm 1 polygon tại giữa màn hình (mặc định có 4 đỉnh hình vuông)</li>
                <li><u>Xóa poly</u>: Xóa polygon đang chọn (không thể undo)</li>
                <li><u>Xoay poly</u>: Xoay polygon đang chọn 1 góc (sẽ hiện khung cho phép nhập góc)</li>
                <li><u>Nhân bản poly</u>: Tạo 1 bản sao (copy+paste) của polygon đang chọn, và đặt vào giữa màn hình</li>
                <li><u>Minimap</u>: Hiển thị bản đồ nhỏ hiển thị map thật của lmht bên phải</li>
                <li><u>Map thật</u>: Hiển thị map thật lmht bên dưới nền</li>
            </ul>

            <u>Dummy: </u>
            <ul>
                <li>Chức năng hiện dummy sẽ hiển thị 1 tướng (ahri) ở giữa màn hình </li>
                <li>Với kích thước 60px (kích thước trong lol2d)</li>
                <li>Giúp so sánh kích thước giữa môi trường và tướng tốt hơn</li>
            </ul>
        </div>
    `,
    });
}
function showOnline() {
    let data = "";
    let count = 0;

    for (let user in onlines) {
        count++;
        if (user != username) {
            data += `<p><u>${user}</u> vào lúc ${onlines[user]}</p>`;
        } else {
            data += `<p><u>${user}</u>(Bạn) vào lúc ${onlines[user]}</p>`;
        }
    }

    Swal.fire({
        title: count + " người đang online",
        html: data,
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
    stroke("#fff9");
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
    isDrawIndex = false,
    fillColor = "#0000"
) {
    stroke("#fff9");
    fill(fillColor);

    // shape
    beginShape();
    for (let p of poly) {
        vertex(p[0] + offset[0], p[1] + offset[1]);
    }
    endShape(CLOSE);

    // points
    if (isDrawDots) {
        noStroke();
        fill("#f009");
        for (let p of poly) {
            circle(p[0] + offset[0], p[1] + offset[1], 10);
        }
    }

    // index
    if (isDrawIndex) {
        noStroke();
        fill("#fff9");
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
        drawTerrain(poly, offset, hightlight, false, c[colorIndex]);
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
        // not decomp yet
        if (terrain.polygons.length == 0) {
            let SATvertices = terrain.polygon.map(
                (point) =>
                    new SAT.Vector(
                        point[0] + terrain.position[0],
                        point[1] + terrain.position[1]
                    )
            );

            if (isMouseInPoly(m, SATvertices)) return terrain;
        }

        // decomped
        else {
            for (let poly of terrain.polygons) {
                let SATvertices = poly.map(
                    (point) =>
                        new SAT.Vector(
                            point[0] + terrain.position[0],
                            point[1] + terrain.position[1]
                        )
                );

                if (isMouseInPoly(m, SATvertices)) return terrain;
            }
        }
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

function getFormattedDate() {
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    var str = `${year}/${month}/${day}/${hour}:${minute}:${second}`;

    return str;
}

function isMouseInCanvas(event) {
    return (
        event.target.id == "defaultCanvas0" &&
        !(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)
    );
}
