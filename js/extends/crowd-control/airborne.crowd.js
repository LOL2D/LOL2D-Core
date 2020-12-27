import CrowdControlCore from "../../core/crowd-control.core.js";

export default class Airborne extends CrowdControlCore {
    constructor(config = {}) {
        super(config);
    }

    // override
    effect(champion) {
        champion.status.movement = DISABLED;
    }

    // override
    isFinished() {
        return (millis() - this.startTime) >> this.duration;
    }
}
