// https://docs.unity3d.com/ScriptReference/Camera.html
import Behaviour from "./Behaviour.js";

export default class Camera extends Behaviour {
    // Returns all cameras in the Scene.
    static #allCameras = [];
    static main = null;

    static get allCameras() {
        return Camera.#allCameras;
    }

    constructor() {
        super();
    }
}
