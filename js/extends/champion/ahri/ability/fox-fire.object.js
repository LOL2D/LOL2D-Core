class FoxFireObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.effectRadius = this.effectRadius - this.owner.radius * 2;
        this.targetMove = null;
        this.radius = 10;
        this.speed = 3;
        this.fillColor = "#058DFF";
        this.positionTrackColor = "#058DFF55";

        // custom attribute
        this.startedTime = millis();
        this.lifeSpan = 5000;
        this.delayTime = 1000;
        this.toTargetSpeed = 10;
        this.rotateSpeed = 2;
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
                let closestEnemy = Helper.Distance.getClosestChampionInRange({
                    rootPosition: this.position,
                    champions: champions,
                    inRange: this.effectRadius,
                    addChampRadiusToRange: true,
                    allyWithPlayer: !this.owner.isAllyWithPlayer,
                    excludes: [this.owner],
                });

                if (closestEnemy) {
                    this.targetMove = closestEnemy.position;
                    this.targetChampion = closestEnemy;
                    this.speed = this.toTargetSpeed;
                    this.isShowPositionTracking = true;
                    this.abilityRef.lastEffectTime = millis();
                }
            }
        } else {
            let touched = Helper.Collide.pointCircle(
                this.position.x,
                this.position.y,
                this.targetChampion.position.x,
                this.targetChampion.position.y,
                this.targetChampion.radius
            );

            if (touched) {
                this.targetChampion.loseHealth(this.damage, this);
                this.touchedTarget = true;
            }

            // ---- test ----
            //this.showLineToTarget();
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

    // other functions here
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

    showLineToTarget() {
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
