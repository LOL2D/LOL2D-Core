class FoxFireObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.effectRadius = this.effectRadius - this.owner.radius * 2;
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
        this.unreadyColor = "#F002";
        this.readyColor = "#00F";
        this.touchedTarget = false;
    }

    // override
    show() {
        this.fillColor = this.isDelayTimeFinished()
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
    effectChampions(champions) {
        if (!this.targetChampion) {
            if (this.isReadyToEffect()) {
                let champ = this.getClosestEnemyInRange(
                    champions,
                    this.effectRadius,
                    true
                );

                if (champ) {
                    this.targetMove = champ.position;
                    this.targetChampion = champ;
                    this.speed = this.toTargetSpeed;
                    this.isShowPositionTracking = true;
                    this.abilityRef.lastEffectTime = millis();
                }
            }
        } else {
            if (this.overlap(this.targetChampion)) {
                this.targetChampion.loseHealth(this.damage);
                this.touchedTarget = true;
            }

            // test - show path to target
            stroke("gray");
            strokeWeight(2);
            line(
                this.position.x,
                this.position.y,
                this.targetChampion.position.x,
                this.targetChampion.position.y
            );
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

        return endOfLife || this.touchedTarget;
    }

    isReadyToEffect() {
        return (
            this.isDelayTimeFinished() && this.abilityRef.isReadyToNextEffect()
        );
    }

    isDelayTimeFinished() {
        return millis() - this.startedTime > this.delayTime;
    }

    calculatePosition() {
        return this.owner.position
            .copy()
            .add(
                p5.Vector.fromAngle(
                    radians(this.angle),
                    this.abilityRef.foxFireRotateRadius + this.radius + 10
                )
            );
    }
}
