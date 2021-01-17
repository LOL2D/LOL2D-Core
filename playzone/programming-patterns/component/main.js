import GameObject from "./core/GameObject.js";
import Camera from "./core/Camera.js";
import TestComponent from "./components/TestComponent.js";

window.setup = function () {
    createCanvas(500, 500);

    let go = new GameObject();
    go.name = "abc";
    go.tag = "player";
    let c = go.addComponent(TestComponent);
    c.sendMessage("doSomething", 1, 2, 3, 4, 5, 6, 7);

    let mainCamera = new GameObject();
    mainCamera.tag = "MainCamera";
    mainCamera.addComponent(Camera);
};

window.draw = function () {
    background(30);
};
