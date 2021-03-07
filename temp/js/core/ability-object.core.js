import COLOR from "../constant/color.constant.js";
import Helper from "../helper/index.js";
import MovementObjectCore from "./movement-object.core.js";

export default class AbilityObjectCore extends MovementObjectCore {
    constructor(config = {}) {
        super(config);

        // default value
        this.world = null;
        this.owner = null;
        this.isStarted = false;
        this.isFinished = false;
        this.effectRadius = 0;
        this.isShowEffectRadius = false;

        Helper.Other.setValueFromConfig(this, config);
    }

    // override
    // show() {}

    // override
    update() {
        if (!this.isStarted) {
            this.onStarted();
            this.isStarted = true;
        }

        super.update();

        if (!this.isFinished) {
            this.isFinished = this.checkFinished();
        }

        this.isFinished && this.onFinished();
    }

    showEffectRadius() {}

    onStarted() {}
    onEffect() {}
    onFinished() {}
    checkFinished() {}
}
