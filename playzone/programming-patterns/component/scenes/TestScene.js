import Scene from "../core/Scene.js";

export default class TestScene extends Scene {
    constructor(name) {
        super(name);
    }

    /**
     * @override
     */
    init() {
        console.log("Init ", this);
    }

    /**
     * @override
     */
    update(dt) {}

    /**
     * @override
     */
    draw() {
        fill(255);
        circle(mouseX, mouseY, 30);
    }

    /**
     * @override
     */
    onEnter() {
        console.log("Đã vào scene " + this.name);
    }

    /**
     * @override
     */
    onExit() {
        console.log("Đã thoát scene " + this.name);
    }
}
