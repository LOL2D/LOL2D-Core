export default class InputManager {
    constructor(game) {
        this.game = game;

        this.connect();
    }

    update(diff) {}

    connect() {
        // bind to p5js events handler
        window.keyPressed = this.keyPressed.bind(this);
        window.keyReleased = this.keyReleased.bind(this);
        window.mousePressed = this.mousePressed.bind(this);
        window.mouseReleased = this.mouseReleased.bind(this);
        window.mouseWheel = this.mouseWheel.bind(this);
    }

    disconnect() {
        window.keyPressed = null;
        window.keyReleased = null;
        window.mousePressed = null;
        window.mouseReleased = null;
        window.mouseWheel = null;
    }

    keyPressed() {
        switch (keyCode) {
            case 81: // Q
                console.log(this.game.player);
                break;
            case 87: // W
                break;
            case 69: // E
                break;
            case 82: // R
                break;
        }
    }

    keyReleased() {}

    mousePressed() {}

    mouseReleased() {}

    mouseWheel(event) {
        const camera = this.game.camera;

        if (event.delta > 0) {
            if (camera.scaleTo > 0.1) camera.scaleTo -= camera.scaleTo / 10;
        } else {
            if (camera.scaleTo < 5) camera.scaleTo += camera.scaleTo / 10;
        }
    }

    getMousePosition() {
        return this.game.camera.canvasToWorld(mouseX, mouseY);
    }
}
