import EventEmitter from "./EventEmitter.js";

let ee;

window.setup = function () {
    createVector(500, 500);

    ee = new EventEmitter();

    ee.on("play", () => console.log("play"));
    ee.on("play", () => console.log("play 2"));
};

window.draw = function () {};

window.keyPressed = function () {
    ee.emit("play");
};
