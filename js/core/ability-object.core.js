class AbilityObjectCore extends MovementObjectCore {
    constructor(config = {}) {
        super(config);

        // default value
        this.owner = null;
        this.isStarted = false;
        this.finished = false; // flag
        this.effectRadius = 0;
        this.isShowEffectRadius = false;

        Helper.Other.setValueFromConfig(this, config);
    }

    run() {
        if (!this.isStarted) {
            this.onStarted();
            this.isStarted = true;
        }

        this.move();
        this.isShowEffectRadius && this.showEffectRadius();
        this.show();

        if (this.checkFinished() || this.finished) {
            this.onFinished();
            this.finished = true;
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
