import Helper from "../../../../helper/index.js";
import AbilityObjectCore from "../../../../core/ability-object.core.js";

export default class OrbOfDeceptionObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.fillColor = "#77f";
        this.isShowPositionTracking = true;
        this.positionTrackColor = "#77F5";
        this.speed = 9;

        // custom attribute
        this.STATE = {
            FORWARD: 1,
            BACKWARD: 2,
        };
        this.state = this.STATE.FORWARD;
        this.effectedChampions = []; // list of  champions effected
        this.maxSpeedBackward = 10;
        this.increaseSpeedBackward = 0.15;

        this.dots = [];
    }

    // override
    update() {
        super.update();

        // backward
        if (this.state == this.STATE.BACKWARD) {
            this.speed += this.increaseSpeedBackward;
            this.speed = constrain(this.speed, 0, this.maxSpeedBackward);
        }

        // forward
        else {
            // check change state
            if (this.isArrivedDestination()) {
                this.state = this.STATE.BACKWARD;
                this.effectedChampions = [];
                this.destination = this.owner.position;
                this.speed = 0;
            }

            // add dots
            if (random() < 0.7) {
                this.dots.push({
                    x: random(
                        this.position.x - this.radius,
                        this.position.x + this.radius
                    ),
                    y: random(
                        this.position.y - this.radius,
                        this.position.y + this.radius
                    ),
                    r: random(5, 10),
                });
            }
        }

        // update dots
        for (let i = this.dots.length - 1; i >= 0; i--) {
            this.dots[i].x += random(-2, 2);
            this.dots[i].y += random(-2, 2);
            this.dots[i].r -= 0.2;

            if (this.dots[i].r <= 0) {
                this.dots.splice(i, 1);
            }
        }
    }

    // override
    show() {
        super.show();

        // show dots
        fill(Helper.Color.applyColorAlpha(this.fillColor, 150));
        noStroke();
        for (let dot of this.dots) {
            circle(dot.x, dot.y, dot.r * 2);
        }
    }

    // override
    effectChampions(champions) {
        let touchedEnemy = Helper.Distance.getClosestChampionInRange({
            rootPosition: this.position,
            champions: champions,
            inRange: this.radius,
            addChampRadiusToRange: true,
            allyWithPlayer: !this.owner.isAllyWithPlayer,
            excludes: [this.owner],
        });

        if (touchedEnemy && this.effectedChampions.indexOf(touchedEnemy) < 0) {
            touchedEnemy.loseHealth(this.damage, this);
            this.effectedChampions.push(touchedEnemy);
        }
    }

    // override
    // move() {}

    // override
    checkFinished() {
        return (
            this.state == this.STATE.BACKWARD &&
            this.dots.length <= 0 &&
            p5.Vector.dist(this.position, this.owner.position) < this.radius
        );
    }
}
