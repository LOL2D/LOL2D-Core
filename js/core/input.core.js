class InputCore {
    constructor(config = {}) {
        this.hotkeys = {
            ...DEFAULT_HOTKEYS,
            ...config.hotkeys,
        };

        this.world = config.world;

        this.mousePos = createVector(0, 0);
        this.previewAbilityId = null;

        this.targetMoveSize = 10;
        this.targetMoveNormalSize = 10;
        this.targetMoveClickSize = 40;
    }

    run() {
        this.mousePos = this.world.getMousePosition();

        if (this.previewAbilityId) {
            this.world.player.previewCastSpell(this.previewAbilityId);
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
                this.previewAbilityId = "spell1";
                break;

            case hotkeys.CastSpell2:
                this.previewAbilityId = "spell2";
                break;

            case hotkeys.CastSpell3:
                this.previewAbilityId = "spell3";
                break;

            case hotkeys.CastSpell4:
                this.previewAbilityId = "spell4";
                break;

            default:
                this.previewAbilityId = null;
        }
    }

    keyReleased(_keyCode) {
        const { hotkeys } = this;

        switch (_keyCode) {
            case hotkeys.ToogleLockCam:
                this.world.camera.isFollow = !this.world.camera.isFollow;
                break;
        }

        if (this.previewAbilityId) {
            this.world.player.castSpell(this.previewAbilityId, this.mousePos);

            this.previewAbilityId = null;
        }
    }

    mouseIsPressed() {
        if (mouseButton == RIGHT) {
            this.targetMoveSize = this.targetMoveClickSize;
            this.world.player.moveTo(this.mousePos.x, this.mousePos.y);
        }
    }

    mousePressed() {
        if (this.previewAbilityId) {
            // cancel cast spell on mouse clicked
            this.previewAbilityId = null;
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
