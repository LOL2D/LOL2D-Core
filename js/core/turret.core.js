import Helper from "../helper/index.js";
import GlobalTime from "../global/time.global.js";
import BulletTurretObject from "../extends/turret/bullet.turret.js";

export default class TurretCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.radius = 50;
        this.fillColor = "red";
        this.strokeColor = "gray";
        this.strokeWeight = 2;

        this.attackRadius = 350;
        this.attackDelayTime = 1500;
        this.lastAttackTime = 0;
        this.attackDamage = 60;
        this.attackTarget = null;

        this.healRadius = 350;
        this.healDelayTime = 1000;
        this.lastHealTime = 0;
        this.healValue = 100;
        this.healManaValue = 50;

        this.sightRadius = 500;
        this.world = null;
        this.isAllyWithPlayer = true;

        Helper.Other.setValueFromConfig(this, config);
    }

    update() {
        this.attack();
        this.heal();
    }

    show() {
        // draw turret
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        circle(this.position.x, this.position.y, this.radius * 2);

        // draw attack radius
        if (this.isAllyWithPlayer) {
            fill("#0000");
            stroke("#5555");
            strokeWeight(this.strokeWeight);
            circle(this.position.x, this.position.y, this.attackRadius * 2);
        }

        if (this.attackTarget) {
            // hightlight attack zone
            if (
                !this.isAllyWithPlayer &&
                this.attackTarget == this.world.player
            ) {
                Helper.Color.createRadialGradient(
                    p5.instance,
                    this.position.x,
                    this.position.y,
                    max(0, this.attackRadius - 50),
                    this.attackRadius,
                    [
                        { stop: 0, color: "#f001" },
                        { stop: 1, color: "#f005" },
                    ]
                );
                circle(this.position.x, this.position.y, this.attackRadius * 2);
            }

            // red line to target
            stroke("#f00");
            line(
                this.position.x,
                this.position.y,
                this.attackTarget.position.x,
                this.attackTarget.position.y
            );
        }
    }

    attack() {
        // allready have target
        if (this.attackTarget) {
            // attack
            if (this.isReadyToNextAttack()) {
                this.world.addNewSpellObjects(
                    new BulletTurretObject({
                        targetChamp: this.attackTarget,
                        destination: this.attackTarget.position,
                        position: this.position.copy(),
                        damage: this.attackDamage,
                    })
                );

                this.lastAttackTime = GlobalTime.getNow();
            }

            // check out of range
            let isInRange = Helper.Collide.circleCircle(
                this.position.x,
                this.position.y,
                this.attackRadius,
                this.attackTarget.position.x,
                this.attackTarget.position.y,
                0
            );
            if (!isInRange) {
                this.attackTarget = null;
            }
        }

        // do not have target
        else {
            // find closest champion
            let closestEnemy = Helper.Distance.getClosestChampionInRange({
                rootPosition: this.position,
                champions: this.world.champions,
                inRange: this.attackRadius,
                allyWithPlayer: !this.isAllyWithPlayer,
                excludes: [],
            });

            // save to attack that champion
            if (closestEnemy) {
                this.attackTarget = closestEnemy;
            }
        }
    }

    heal() {
        if (this.isReadyToNextHeal()) {
            let allies = Helper.Distance.getChampionsInRange({
                rootPosition: this.position,
                champions: this.world.champions,
                inRange: this.attackRadius,
                allyWithPlayer: this.isAllyWithPlayer,
                excludes: [],
            });

            for (let a of allies) {
                a.heal(this.healValue);
                a.addMana(this.healManaValue);
            }

            this.lastHealTime = GlobalTime.getNow();
        }
    }

    isReadyToNextHeal() {
        return GlobalTime.getNow() - this.lastHealTime >= this.healDelayTime;
    }

    isReadyToNextAttack() {
        return (
            GlobalTime.getNow() - this.lastAttackTime >= this.attackDelayTime
        );
    }
}
