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

        this.healRadius = 350;
        this.healDelayTime = 1000;
        this.lastHealTime = 0;
        this.healValue = 100;

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

        noFill();
        stroke("#555");
        strokeWeight(1);
        circle(this.position.x, this.position.y, this.attackRadius * 2);
    }

    attack() {
        let closestEnemy = Helper.Distance.getClosestChampionInRange({
            rootPosition: this.position,
            champions: this.world.champions,
            inRange: this.attackRadius,
            allyWithPlayer: !this.isAllyWithPlayer,
            excludes: [],
        });

        if (closestEnemy) {
            stroke("red");
            line(
                this.position.x,
                this.position.y,
                closestEnemy.position.x,
                closestEnemy.position.y
            );

            if (this.isReadyToNextAttack()) {
                closestEnemy.loseHealth(this.attackDamage);
                this.lastAttackTime = millis();
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
