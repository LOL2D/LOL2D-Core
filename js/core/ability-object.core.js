import COLOR from "../constant/color.constant.js";
import Helper from "../helper/index.js";
import MovementObjectCore from "./movement-object.core.js";

export default class AbilityObjectCore extends MovementObjectCore {
    constructor(config = {}) {
        super(config);

        // default value
        this.owner = null;
        this.isStarted = false;
        this.effectRadius = 0;
        this.isShowEffectRadius = false;

        Helper.Other.setValueFromConfig(this, config);
    }

    // override
    show() {
        super.show();
        this.isShowEffectRadius && this.showEffectRadius();
    }

    update() {
        if (!this.isStarted) {
            this.onStarted();
            this.isStarted = true;
        }

        this.move();

        if (this.checkFinished()) {
            this.onFinished();
        }
    }

    showEffectRadius() {
        stroke(COLOR.ABILITY.INDICATOR.BORDER);
        fill(COLOR.ABILITY.INDICATOR.FILL);
        strokeWeight(3);
        circle(this.position.x, this.position.y, this.effectRadius * 2);
    }

    onStarted() {}
    onFinished() {}
    checkFinished() {}
    effectChampions() {}
    effectAbilities() {}
}
