import GlobalTime from "../global/time.global.js";
import Helper from "../helper/index.js";

export default class EffectOnChampion {
    constructor(config) {
        this.owner = null; // tướng tạo ra effect này (dealing)
        this.target = null; // tướng chịu tác dụng của effect này (taking)
        this.duration = 0; // thời gian tác động

        this.isStarted = false;
        this.isFinished = false;

        Helper.Other.setValueFromConfig(this, config);
    }

    onStarted() {
        this.startTime = GlobalTime.getNow();
    }

    update() {
        if (!this.isStarted) {
            this.onStarted();
            this.isStarted = true;
        }

        if (!this.isFinished) {
            this.isFinished = this.checkFinished();
            this.isFinished && this.onFinished();
        }
    }

    show() {}

    onEffect() {}

    onFinished() {}

    checkFinished() {}

    isDurationEnd() {
        return GlobalTime.getNow() - this.startTime > this.duration;
    }
}
