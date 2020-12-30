import { ALLOWED, DISABLED } from "../../constant/crowd-control.constant.js";
import Helper from "../../helper/index.js";
import EffectOnChampion from "../../core/effect-on-champion.core.js";

export default class DashEffect extends EffectOnChampion {
    constructor(config) {
        super(config);

        this.destination = this.owner.position.copy();
        this.speed = 0;

        Helper.Other.setValueFromConfig(this, config);
    }

    // override
    onStarted() {
        super.onStarted();

        if (!this.target.isCheckCollideTerrain) this.isFinished = true;

        this.target.isShowPositionTracking = true;
        this.target.isCheckCollideTerrain = false;
        this.target.status.movement = DISABLED;
        this.target.moveTo(this.destination.x, this.destination.y);
    }

    // override
    // update() {}

    // override
    show() {
        super.show();
    }

    // override
    onEffect() {
        const { destination, speed } = this;

        let direction = p5.Vector.sub(destination, this.target.position);
        this.target.position.add(direction.setMag(speed));
    }

    // override
    onFinished() {
        this.target.isShowPositionTracking = false;
        this.target.isCheckCollideTerrain = true;
        this.target.status.movement = ALLOWED;
    }

    // override
    checkFinished() {
        return (
            p5.Vector.dist(this.destination, this.target.position) < this.speed
        );
    }
}
