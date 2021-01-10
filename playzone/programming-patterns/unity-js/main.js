import GameObject from "./core/GameObject.js";
import BaseObject from "./core/BaseObject.js";
import MonoBehaviour from "./core/MonoBehaviour.js";

window.setup = () => {
    createCanvas(500, 500);

    new BaseObject();
    let g = new GameObject();
    new GameObject();

    g.addComponent(MonoBehaviour);

    console.log("All: ", BaseObject._objects);
    console.log("First BaseObject: ", BaseObject.findObjectOfType(BaseObject));
    console.log("All BaseObjects: ", BaseObject.findObjectsOfType(BaseObject));
    console.log("All GameObjects: ", BaseObject.findObjectsOfType(GameObject));
    console.log("All Mono: ", BaseObject.findObjectsOfType(MonoBehaviour));
};

window.draw = () => {
    background(30);
};
