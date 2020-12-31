let p;
let c;

function setup() {
    createCanvas(2000, 2000);

    p = [
        { x: 85, y: 57 },
        { x: 146, y: 39 },
        { x: 156, y: 75 },
        { x: 152, y: 156 },
        { x: 150, y: 212 },
        { x: 169, y: 264 },
        { x: 217, y: 332 },
        { x: 296, y: 404 },
        { x: 369, y: 463 },
        { x: 457, y: 511 },
        { x: 524, y: 530 },
        { x: 614, y: 531 },
        { x: 708, y: 525 },
        { x: 761, y: 492 },
        { x: 811, y: 493 },
        { x: 868, y: 520 },
        { x: 917, y: 515 },
        { x: 993, y: 535 },
        { x: 677, y: 813 },
        { x: 628, y: 813 },
        { x: 576, y: 773 },
        { x: 415, y: 711 },
        { x: 147, y: 657 },
        { x: 133, y: 632 },
        { x: 183, y: 570 },
        { x: 206, y: 522 },
        { x: 204, y: 466 },
        { x: 176, y: 397 },
        { x: 130, y: 352 },
        { x: 76, y: 321 },
        { x: 58, y: 268 },
        { x: 54, y: 197 },
    ];
}

function draw() {
    background(30);

    let cx = mouseX;
    let cy = mouseY;

    let SATpolygon = new SAT.Polygon(
        new SAT.Vector(),
        p.map((point) => new SAT.Vector(point.x, point.y))
    );

    let SATcircle = new SAT.Circle(new SAT.Vector(cx, cy), 20);

    let response = new SAT.Response();
    let collided = SAT.testPolygonCircle(SATpolygon, SATcircle, response);

    if (collided) {
        fill("red");
        // console.log(response);
        cx += response.overlapV.x;
        cy += response.overlapV.y;
    } else {
        fill("white");
    }

    beginShape();
    for (let point of p) {
        vertex(point.x, point.y);
    }
    endShape();

    circle(cx, cy, 40);
}
