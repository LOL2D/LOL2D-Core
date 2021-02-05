import Helper from "../../../../helper/index.js";
import GlobalTime from "../../../../global/time.global.js";
import AbilityObjectCore from "../../../../core/ability-object.core.js";

export default class FoxFireObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.effectRadius = this.effectRadius - this.owner.radius * 2;
        this.speed = 3;
        this.positionTrackColor = "#058DFF55";

        // custom attribute
        this.startedTime = GlobalTime.getNow();
        this.lifeSpan = 5000;
        this.delayTime = 1000;
        this.toTargetSpeed = 10;
        this.rotateSpeed = 2;
        this.targetChampion = null;
        this.unreadyColor = "#F002";
        this.readyColor = "#00F";
        this.touchedTarget = false;

        // set default fillColor to unreadyColor
        this.fillColor = this.unreadyColor;
    }

    // override
    update() {
        super.update();

        // change color if delay time finished (ready to attack)
        if (this.fillColor != this.readyColor && this.isDelayTimeFinished()) {
            this.fillColor = this.readyColor;
        }
    }

    // override
    // show() {}

    // override
    onEffect() {
        if (!this.targetChampion) {
            if (this.isReadyToEffect()) {
                let closestEnemy = this.world.getClosestChampionInRange({
                    rootPosition: this.position,
                    champions: this.owner.championsInSight,
                    inRange: this.effectRadius,
                    addChampRadiusToRange: true,
                    allyWithPlayer: !this.owner.isAllyWithPlayer,
                    excludes: [this.owner],
                });

                if (closestEnemy) {
                    this.destination = closestEnemy.position;
                    this.targetChampion = closestEnemy;
                    this.speed = this.toTargetSpeed;
                    this.isShowPositionTracking = true;
                    this.abilityRef.lastEffectTime = GlobalTime.getNow();
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
            !this.targetChampion &&
            GlobalTime.getNow() - this.startedTime > this.lifeSpan;

        return endOfLife || this.touchedTarget;
    }

    // other functions here
    isReadyToEffect() {
        return (
            this.isDelayTimeFinished() && this.abilityRef.isReadyToNextEffect()
        );
    }

    isDelayTimeFinished() {
        return GlobalTime.getNow() - this.startedTime > this.delayTime;
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
