// tip: https://www.w3schools.com/graphics/canvas_gradients.asp
// live demo: https://editor.p5js.org/HoangTran0410/sketches/iMYZsZR1f

let grd;
let colorStops;

function setup() {
    createCanvas(400, 400);

    colorStops = [
        { stop: 0, color: "#1111" },
        //{stop: 0.5, color: "#1119"},
        { stop: 1, color: "#4AECF233" },
    ];
}

function draw() {
    background(30);
  
    // NOTE, do not use noFill before create Gradient
    //noFill();

    //linearGradient();
    stroke("#4AECF2ee");
    strokeWeight(3);

    createLinearGradient(50, 50, 100, 50, colorStops);
    rect(50, 50, 100, 50);

    createRadialGradient(mouseX, mouseY, 50, 100, colorStops);
    circle(mouseX, mouseY, 200);

    fill(255);
    noStroke();
    text("FPS: " + ~~frameRate(), 10, 10);
}

function createLinearGradient(x, y, w, h, colorStops) {
    grd = drawingContext.createLinearGradient(x, y, x + w, y);
    for (let i = 0; i < colorStops.length; i++) {
        grd.addColorStop(colorStops[i].stop, colorStops[i].color);
    }
    drawingContext.fillStyle = grd;
}

function createRadialGradient(x, y, r1, r2, colorStops) {
    grd = drawingContext.createRadialGradient(x, y, r1, x, y, r2);
    for (let i = 0; i < colorStops.length; i++) {
        grd.addColorStop(colorStops[i].stop, colorStops[i].color);
    }
    drawingContext.fillStyle = grd;
}