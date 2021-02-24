export default class InputManager {
    constructor(game) {
        this.game = game;

        this.connect();
    }

    update(diff) {
        if (mouseIsPressed) {
            if (mouseButton == RIGHT) {
                let { x, y } = this.getMousePosition();
                this.game.player.destination.set(x, y);
            }
        }
    }

    connect() {
        // bind to p5js events handler
        window.keyPressed = this.keyPressed.bind(this);
        window.keyReleased = this.keyReleased.bind(this);
        window.mousePressed = this.mousePressed.bind(this);
        window.mouseReleased = this.mouseReleased.bind(this);
    }

    disconnect() {
        window.keyPressed = null;
        window.keyReleased = null;
        window.mousePressed = null;
        window.mouseReleased = null;
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

    getMousePosition() {
        return this.game.camera.canvasToWorld(mouseX, mouseY);
    }
}
