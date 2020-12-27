let polygons = [
    [
        [240, 240],
        [260, 240],
        [260, 260],
        [240, 260],
    ],
    [
        [240, 260],
        [260, 260],
        [260, 280],
        [240, 280],
    ],
    [
        [260, 240],
        [280, 240],
        [280, 260],
        [260, 260],
    ],
    [
        [440, 240],
        [460, 240],
        [460, 260],
        [440, 260],
    ],
    [
        [250, 100],
        [260, 140],
        [240, 140],
    ],
    [
        [280, 100],
        [290, 60],
        [270, 60],
    ],
    [
        [310, 100],
        [320, 140],
        [300, 140],
    ],
    [
        [50, 450],
        [60, 370],
        [70, 450],
    ],
    [
        [450, 450],
        [460, 370],
        [470, 450],
    ],
    [
        [50, 50],
        [60, 30],
        [70, 50],
    ],
    [
        [450, 50],
        [460, 30],
        [470, 50],
    ],
    [
        [140, 340],
        [160, 240],
        [180, 340],
        [360, 340],
        [360, 360],
        [250, 390],
        [140, 360],
    ],
    [
        [140, 140],
        [150, 130],
        [150, 145],
        [165, 150],
        [160, 160],
        [140, 160],
    ],

    [
        [100, 150],
        [100, 100],
    ],
    [
        [50, 125],
        [100, 125],
    ], // intersects
    [
        [450, 100],
        [400, 150],
    ],
    [
        [450, 150],
        [400, 100],
    ], // intersects
    [
        [50, 250],
        [100, 250],
    ],
    [
        [50, 250],
        [100, 250],
    ], // duplicate
    [
        [140, 40],
        [140, 60],
    ],
    [
        [140, 60],
        [160, 60],
    ],
    [
        [160, 60],
        [160, 40],
    ],
    [
        [160, 40],
        [140, 40],
    ],
];

let segments = [];

function setup() {
    createCanvas(800, 600);
}

function draw() {
    background(30);

    // move polygons
    let delX = 0,
        delY = 0,
        speed = 3;
    if (keyIsDown(LEFT_ARROW)) delX = speed;
    if (keyIsDown(RIGHT_ARROW)) delX = -speed;
    if (keyIsDown(UP_ARROW)) delY = speed;
    if (keyIsDown(DOWN_ARROW)) delY = -speed;

    for (let poly of polygons) {
        for (let p of poly) {
            p[0] += delX;
            p[1] += delY;
        }
    }

    // draw polygons
    fill("#5555");
    stroke("white");
    for (let poly of polygons) {
        beginShape();
        for (let p of poly) {
            vertex(p[0], p[1]);
        }
        endShape(CLOSE);
    }

    // draw source light
    var sourcelight = [mouseX, mouseY];
    fill("yellow");
    noStroke();
    circle(sourcelight[0], sourcelight[1], 20);

    // calculate
    segments = VisibilityPolygon.convertToSegments(polygons);
    segments = VisibilityPolygon.breakIntersections(segments);

    var viewportVisibility = VisibilityPolygon.computeViewport(
        sourcelight,
        segments,
        [0, 0],
        [width, height]
    );

    // show result
    fill("#fff6");
    noStroke();
    beginShape();
    for (let p of viewportVisibility) {
        vertex(p[0], p[1]);
    }
    endShape(CLOSE);

    // help
    fill("white");
    noStroke();
    text("Use ARROW KEY to move, move mouse to move light source.", 10, 20);
    text("FPS: " + ~~frameRate(), 10, 40);
}
