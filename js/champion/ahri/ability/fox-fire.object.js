class FoxFireObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.effectRadius = this.effectRadius - this.owner.radius * 2;
        this.isShowPositionTracking = true;
        this.targetMove = null;
        this.radius = 15;
        this.speed = 4;

        // custom attribute
        this.startedTime = millis();
        this.lifeSpan = 5000;
        this.delayTime = 1000;
        this.toTargetSpeed = 15;
        this.rotateSpeed = 4;
        this.targetChampion = null;
        this.unreadyColor = "#00F5";
        this.readyColor = "#00F";
    }

    // override
    show() {
        this.fillColor = this.isReadyToEffect()
            ? this.readyColor
            : this.unreadyColor;

        super.show();
    }

    // override
    overlap(champion) {
        return this.targetChampion
            ? super.overlap(champion, this.radius)
            : super.overlap(champion, this.effectRadius + champion.radius);
    }

    // override
    effect(champion) {
        if (!this.targetChampion) {
            if (
                this.isReadyToEffect() &&
                this.abilityRef.isReadyToNextEffect()
            ) {
                this.targetMove = champion.position;
                this.targetChampion = champion;
                this.speed = this.toTargetSpeed;
                this.abilityRef.lastEffectTime = millis();
            }
        } else {
            champion.loseHealth(this.damage);
        }
    }

    // override
    move() {
        super.move();

        // rotate
        if (!this.targetChampion) {
            this.angle += this.rotateSpeed;
            this.position = this.calculatePosition();
        }
    }

    // override
    checkFinished() {
        let endOfLife =
            !this.targetChampion && millis() - this.startedTime > this.lifeSpan;

        let touchedTarget =
            this.targetChampion && this.overlap(this.targetChampion);

        return endOfLife || touchedTarget;
    }

    isReadyToEffect() {
        return millis() - this.startedTime > this.delayTime;
    }

    calculatePosition() {
        return this.owner.position
            .copy()
            .add(
                p5.Vector.fromAngle(radians(this.angle), this.owner.radius * 2)
            );
    }
}
