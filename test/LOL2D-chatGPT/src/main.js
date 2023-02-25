import Camera from "./map/Camera.js";
import GroundMap from "./map/GroundMap.js";
import Champion from "./Champion.js";
import { disableRightClick } from "./utils.js";

let player;
let champions = [];
let camera, groundMap;

export function setup() {
    let c = createCanvas(windowWidth, windowHeight);
    disableRightClick(c.elt);

    for (let i = 0; i < 10; i++)
        champions.push(new Champion(random(width), random(height)));

    player = champions[0];
    player.color = 255;

    camera = new Camera();
    groundMap = new GroundMap();

    camera.follow(player.position);
}

export function draw() {
    background(30);

    camera.update();
    camera.beginState();

    groundMap.drawEdge(camera);
    groundMap.drawGrid(camera);

    for (let champ of champions) {
        champ.run();
    }

    if (mouseIsPressed && mouseButton === RIGHT) {
        let worldPosition = camera.canvasToWorld(mouseX, mouseY);
        player.setDestination(worldPosition.x, worldPosition.y);
    }

    camera.endState();
}

export function mouseWheel(event) {
    camera.scaleTo -= event.delta / 1000;
    if (camera.scaleTo < 0.5) camera.scaleTo = 0.5;
}

export function mousePressed() {}

export function keyPressed() {
    if (key === "q") {
        player.castSpell(0);
    }
}

export function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
}
