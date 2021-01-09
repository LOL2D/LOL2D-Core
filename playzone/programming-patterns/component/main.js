import GameObject from "./core/GameObject.js";
import BaseObject from "./core/BaseObject.js";

window.setup = () => {
    createCanvas(500, 500);

    new BaseObject();
    new GameObject();
    new GameObject();

    console.log(BaseObject._objects);

    console.log(BaseObject.findObjectOfType(BaseObject));
    console.log(BaseObject.findObjectsOfType(GameObject));
};

window.draw = () => {
    background(30);
};
