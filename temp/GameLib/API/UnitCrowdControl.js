export default class UnitCrowdControl {
    constructor(type, duration = -1) {
        this.type = type;
        this.duration = duration;
        this.currentTime = 0;
        this.isRemoved = false;
    }

    update(diff) {
        this.currentTime += diff / 1000;
        if (
            this.currentTime >= this.duration &&
            !this.isRemoved &&
            Math.Abs(this.duration - -1) > 0.0001
        ) {
            this.isRemoved = true;
        }
    }

    isTypeOf(type) {
        return this.type == type;
    }
}
