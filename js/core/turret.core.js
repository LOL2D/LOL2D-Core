class TurretCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.radius = 50;
        this.fillColor = "red";
        this.strokeColor = "gray";
        this.strokeWeight = 2;

        this.attackRadius = 350;
        this.attackDelayTime = 1500;
        this.lastAttackTime = 0;
        this.attackDamage = 100;
        this.attackTarget = null;

        this.healRadius = 350;
        this.healDelayTime = 1000;
        this.lastHealTime = 0;
        this.healValue = 100;
        this.healManaValue = 180;

        this.sightRadius = 500;
        this.world = null;
        this.isAllyWithPlayer = true;

        Helper.Other.setValueFromConfig(this, config);
    }

    run() {
        this.attack();
        this.heal();
        this.show();
    }

    show() {
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        circle(this.position.x, this.position.y, this.radius * 2);

        fill(Helper.Color.applyColorAlpha(this.fillColor, 20));
        stroke("#555");
        strokeWeight(this.strokeWeight);
        circle(this.position.x, this.position.y, this.attackRadius * 2);
    }

    attack() {
        // allready have target
        if (this.attackTarget) {
            // red line
            stroke("#f005");
            line(
                this.position.x,
                this.position.y,
                this.attackTarget.position.x,
                this.attackTarget.position.y
            );

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

                this.lastAttackTime = millis();
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
        let allies = Helper.Distance.getChampionsInRange({
            rootPosition: this.position,
            champions: this.world.champions,
            inRange: this.attackRadius,
            allyWithPlayer: this.isAllyWithPlayer,
            excludes: [],
        });

        if (this.isReadyToNextHeal()) {
            for (let a of allies) {
                a.heal(this.healValue);
                a.addMana(this.healManaValue);
            }
            this.lastHealTime = millis();
        }
    }

    isReadyToNextHeal() {
        return millis() - this.lastHealTime >= this.healDelayTime;
    }

    isReadyToNextAttack() {
        return millis() - this.lastAttackTime >= this.attackDelayTime;
    }
}
