class InputCore {
    constructor(config = {}) {
        this.hotkeys = {
            ...DEFAULT_HOTKEYS,
            ...config.hotkeys,
        };

        this.world = config.world;

        this.mousePos = createVector(0, 0);
        this.showIndicatorId = null;

        this.targetMoveSize = 10;
        this.targetMoveNormalSize = 10;
        this.targetMoveClickSize = 40;
    }

    run() {
        this.mousePos = this.world.getMousePosition();

        if (this.showIndicatorId) {
            this.world.player.showIndicator(this.showIndicatorId);
        }

        if (this.world.player.targetMove) {
            fill("green");
            noStroke();
            circle(
                this.world.player.targetMove.x,
                this.world.player.targetMove.y,
                this.targetMoveSize
            );
        }

        this.targetMoveSize -= 3;
        this.targetMoveSize = constrain(
            this.targetMoveSize,
            this.targetMoveNormalSize,
            this.targetMoveClickSize
        );
    }

    keyDown(_keyCode) {}

    keyPressed(_keyCode) {
        const { hotkeys } = this;

        switch (_keyCode) {
            case hotkeys.CastSpell1:
                this.showIndicatorId = "spell1";
                break;

            case hotkeys.CastSpell2:
                this.showIndicatorId = "spell2";
                break;

            case hotkeys.CastSpell3:
                this.showIndicatorId = "spell3";
                break;

            case hotkeys.CastSpell4:
                this.showIndicatorId = "spell4";
                break;

            default:
                this.showIndicatorId = null;
        }
    }

    keyReleased(_keyCode) {
        const { hotkeys } = this;

        switch (_keyCode) {
            case hotkeys.ToogleLockCam:
                this.world.camera.isFollow = !this.world.camera.isFollow;
                break;
        }

        if (this.showIndicatorId) {
            this.world.player.castSpell(this.showIndicatorId, this.mousePos);

            this.showIndicatorId = null;
        }
    }

    mouseIsPressed() {
        if (mouseButton == RIGHT) {
            this.targetMoveSize = this.targetMoveClickSize;
            this.world.player.moveTo(this.mousePos.x, this.mousePos.y);
        }
    }

    mousePressed() {
        if (this.showIndicatorId) {
            // cancel cast spell on mouse clicked
            this.showIndicatorId = null;
        }
    }

    mouseWheel(event) {
        const { camera } = this.world;

        if (event.delta > 0) {
            if (camera.scaleTo > 0.5) camera.scaleTo -= camera.scaleTo / 10;
        } else {
            if (camera.scaleTo < 5) camera.scaleTo += camera.scaleTo / 10;
        }
    }
}
