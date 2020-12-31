import {
    ALLOWED,
    DISABLED,
    UNCONTROLLABLE,
} from "../../constant/crowd-control.constant.js";
import Helper from "../../helper/index.js";
import EffectOnChampion from "../../core/effect-on-champion.core.js";
import GlobalTime from "../../global/time.global.js";

export default class CharmCrowd extends EffectOnChampion {
    constructor(config) {
        super(config);

        // override

        // custom attribute
        this.duration = 1000;
        this.dots = [];

        Helper.Other.setValueFromConfig(this, config);
    }

    // override
    onStarted() {
        super.onStarted();

        if (!this.target.isCheckCollideTerrain) this.isFinished = true;
        this.target.status.movement = DISABLED;
        this.target.status.abilities = DISABLED;
        this.target.status.attacking = DISABLED;
    }

    // override
    update() {
        super.update();

        const { position, radius } = this.target;

        if (random() < 0.05) {
            this.dots.push({
                x: position.x + random(-radius, radius),
                y: position.y + random(-radius, radius),
                r: random(5, 15),
            });
        }

        for (let i = this.dots.length - 1; i >= 0; i--) {
            this.dots[i].x += random(-2, 2);
            this.dots[i].y += random(-4, 2);
            this.dots[i].r -= 0.2;

            if (this.dots[i].r <= 0) {
                this.dots.splice(i, 1);
            }
        }
    }

    // override
    show() {
        super.show();

        for (let d of this.dots) {
            fill("#f5429588");
            noStroke();

            circle(d.x, d.y, d.r * 2);
        }
    }

    // override
    onEffect() {
        const { position: destination } = this.owner;
        const { speed, position } = this.target;

        let direction = p5.Vector.sub(destination, position);
        this.target.position.add(direction.setMag(speed - speed * 0.65));
    }

    // override
    onFinished() {
        this.target.status.movement = ALLOWED;
        this.target.status.abilities = ALLOWED;
        this.target.status.attacking = ALLOWED;
    }

    // override
    checkFinished() {
        return GlobalTime.getNow() - this.startTime > this.duration;
    }
}
