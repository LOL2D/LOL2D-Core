let rects = [];
let quadtree;

let rectTest = [
    { x: 128, y: 521, w: 62, h: 77 },
    { x: 395, y: 397, w: 134, h: 106 },
    { x: 497, y: 563, w: 125, h: 94 },
    { x: 22, y: 466, w: 62, h: 56 },
    { x: 48, y: 515, w: 113, h: 32 },
    { x: 623, y: 364, w: 85, h: 131 },
    { x: 250, y: 211, w: 27, h: 20 },
    { x: 493, y: 29, w: 32, h: 73 },
    { x: 482, y: 541, w: 51, h: 60 },
    { x: 781, y: 561, w: 48, h: 38 },
    { x: 68, y: 47, w: 117, h: 113 },
    { x: 322, y: 70, w: 117, h: 81 },
    { x: 744, y: 222, w: 21, h: 98 },
    { x: 223, y: 365, w: 97, h: 81 },
    { x: 322, y: 101, w: 124, h: 79 },
    { x: 486, y: 127, w: 37, h: 57 },
    { x: 277, y: 157, w: 137, h: 128 },
    { x: 392, y: 407, w: 149, h: 149 },
    { x: 95, y: 44, w: 21, h: 130 },
    { x: 255, y: 433, w: 92, h: 14 },
    { x: 285, y: 293, w: 121, h: 42 },
    { x: 421, y: 268, w: 39, h: 89 },
    { x: 214, y: 428, w: 31, h: 123 },
    { x: 344, y: 281, w: 61, h: 122 },
    { x: 624, y: 342, w: 72, h: 117 },
];

function setup() {
    createCanvas(800, 600);

    // generate rects
    // let i = 0;
    // while (i++ < 25) {
    //     rects.push({
    //         x: ~~random(width),
    //         y: ~~random(height),
    //         w: ~~random(10, 150),
    //         h: ~~random(10, 150),
    //     });
    // }

    rects = rectTest;

    // init quadtree
    quadtree = new Quadtree(
        {
            x: 0,
            y: 0,
            w: width,
            h: height,
        },
        2
    );

    // add rects to quadtree
    for (let r of rects) {
        quadtree.insert({
            x: r.x,
            y: r.y,
            w: r.w,
            h: r.h,
            ref: r, // reference to rect object
        });
    }
}

function draw() {
    background(30);

    // draw grid
    drawQuadtree(quadtree);

    // draw rects
    for (let r of rects) {
        fill("yellow");
        noStroke();
        circle(r.x, r.y, 10);

        fill("#9995");
        stroke("white");
        rect(r.x, r.y, r.w, r.h);
    }

    // get rect near mouse
    let range = {
        x: mouseX,
        y: mouseY,
        w: 20,
        h: 20,
    };
    let data = quadtree.retrieve(range);

    // hight light rects near mouse
    fill("white");
    for (let r of data) {
        rect(r.x, r.y, r.w, r.h);
    }

    // show mouse
    noFill();
    stroke("white");
    rect(range.x, range.y, range.w, range.h);
}

function drawQuadtree(node) {
    var bounds = node.bounds;

    //no subnodes? draw the current node
    if (node.nodes.length === 0) {
        stroke("#f003");
        noFill();
        strokeWeight(1);
        rect(bounds.x, bounds.y, bounds.w, bounds.h);

        //has subnodes? drawQuadtree them!
    } else {
        for (var i = 0; i < node.nodes.length; i++) {
            this.drawQuadtree(node.nodes[i]);
        }
    }
}
