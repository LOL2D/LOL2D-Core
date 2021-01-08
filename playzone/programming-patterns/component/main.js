import GameObject from "./components/GameObject.js";

window.setup = () => {
    createCanvas(500, 500);

    new GameObject();
};

window.draw = () => {
    background(30);
};
