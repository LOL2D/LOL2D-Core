class FoxFireObject extends AbilityObjectCore {
    constructor(config = {}) {
        super(config);

        this.fillColor = "blue";
        this.isShowPositionTracking = true;

        this.startedTime = millis();
        this.lifeSpan = 5000;
        this.delayTime = 1000;
        this.speed = 4;
        this.toTargetSpeed = 15;
        this.rotateSpeed = 4;
        this.radius = 15;

        this.targetMove = null;
        this.targetChampion = null;
        this.effectRadius = this.effectRadius - this.owner.radius * 2;

        // line track effect
        this.tracks = [];
    }

    // override
    show() {
        if (this.isReadyToEffect()) {
            this.fillColor = "blue";
        } else {
            this.fillColor = "#0505";
        }

        super.show();
    }

    // override
    overlap(champion) {
        if (!this.targetChampion) {
            return super.overlap(champion, this.effectRadius + champion.radius);
        }

        return super.overlap(champion);
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
