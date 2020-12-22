let p;
let c;

function setup() {
    createCanvas(800, 600);

    p = [
        { x: 100, y: 100 },
        { x: 200, y: 300 },
        { x: 50, y: 250 },
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
