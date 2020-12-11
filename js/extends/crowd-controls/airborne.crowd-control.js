class Airborne extends CrowdControl {
    constructor(config = {}) {
        super(config);
    }

    effect(champion) {
        champion.status.movement = DISABLED;
    }

    isFinished() {
        return (millis() - this.startTime) >> this.duration;
    }
}
