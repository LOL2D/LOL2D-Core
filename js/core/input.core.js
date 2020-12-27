import DEFAULT_HOTKEYS from "../constant/hotkeys.constant.js";
import Helper from "../helper/index.js";

export default class InputCore {
    constructor(config = {}) {
        this.hotkeys = {
            ...DEFAULT_HOTKEYS,
            ...config.hotkeys,
        };

        this.world = config.world;

        this.mousePos = createVector(0, 0);
        this.enemyAtMouse = null;
        this.showIndicatorId = null;

        this.destinationSize = 10;
        this.destinationNormalSize = 10;
        this.destinationClickSize = 40;
    }

    run() {
        this.mousePos = this.world.getMousePosition();

        // basic attack
        this.enemyAtMouse = this.getEnemyAtMouse();
        if (this.enemyAtMouse) {
            cursor(globalassets.cursor.fight);

            // hightlight target
            stroke("red");
            strokeWeight(3);
            circle(
                this.enemyAtMouse.position.x,
                this.enemyAtMouse.position.y,
                this.enemyAtMouse.radius * 2.5
            );
        } else {
            cursor(globalassets.cursor.normal);
        }

        // show indicator
        if (this.showIndicatorId) {
            this.world.player.showIndicator(this.showIndicatorId);
        }

        // show destination
        if (this.world.player.destination) {
            fill("green");
            noStroke();
            circle(
                this.world.player.destination.x,
                this.world.player.destination.y,
                this.destinationSize
            );
        }

        this.destinationSize -= 3;
        this.destinationSize = constrain(
            this.destinationSize,
            this.destinationNormalSize,
            this.destinationClickSize
        );
    }

    // --------------- events ---------------
    keyDown(_keyCode) {}

    keyPressed(_keyCode) {
        const { hotkeys } = this;

        switch (_keyCode) {
            case hotkeys.basicAttack:
                this.showIndicatorId = "basicAttack";
                break;

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
        if (mouseButton == RIGHT && !this.enemyAtMouse) {
            this.destinationSize = this.destinationClickSize;
            this.world.player.moveTo(this.mousePos.x, this.mousePos.y);
        }
    }

    mousePressed() {
        if (mouseButton == RIGHT) {
            if (this.enemyAtMouse) {
                this.basicAttackChampion(this.enemyAtMouse);
            }

            if (this.showIndicatorId) {
                // cancel cast spell on mouse clicked
                this.showIndicatorId = null;
            }
        }

        if (mouseButton == LEFT) {
            this.keyReleased();
        }
    }

    mouseWheel(event) {
        const { camera } = this.world;

        if (event.delta > 0) {
            if (camera.scaleTo > 0.1) camera.scaleTo -= camera.scaleTo / 10;
        } else {
            if (camera.scaleTo < 5) camera.scaleTo += camera.scaleTo / 10;
        }
    }

    // --------------- helpers ---------------
    basicAttackChampion(champ) {
        let distance = p5.Vector.dist(
            this.world.player.position,
            champ.position
        );

        if (distance > this.world.player.basicAttackRadius) {
            // move closer
            let vecRange = Helper.Vector.getVectorWithRange(
                champ.position,
                this.world.player.position,
                this.world.player.basicAttackRadius
            );
            this.world.player.destination.set(vecRange.to.x, vecRange.to.y);
        } else {
            // stop move to attack
            this.world.player.destination.removeDestination();
            this.world.player.basicAttack(champ.position.copy());
        }
    }

    getEnemyAtMouse() {
        for (let champ of this.world.champions) {
            if (!champ.isAllyWithPlayer) {
                let isHover = Helper.Collide.pointCircle(
                    this.mousePos.x,
                    this.mousePos.y,
                    champ.position.x,
                    champ.position.y,
                    champ.radius
                );

                if (isHover) {
                    return champ;
                }
            }
        }

        return null;
    }
}
