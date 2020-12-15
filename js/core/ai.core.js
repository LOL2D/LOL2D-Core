class AICore {
    constructor(config = {}) {
        this.champion = null;
        this.world = null;
        this.autoAttackRadius = 300;

        Helper.Other.setValueFromConfig(this, config);

        // setup
        this.champion.targetMove = this.champion.position.copy();
        this.mode = "attack";
    }

    run() {
        //this.autoShow();
        this.autoChangeMode();
        this.autoMove();
        this.autoAttack();
        this.autoDefense();
    }

    autoShow() {
        noFill();
        stroke("#fff2");
        strokeWeight(1);

        circle(
            this.champion.position.x,
            this.champion.position.y,
            this.autoAttackRadius * 2
        );
    }

    autoMove() {
        // basic move
        if (this.mode == "attack") {
            if (this.champion.isArrivedTargetMove()) {
                let len = random(100, 1000);
                let newTarget = this.champion.position
                    .copy()
                    .add(random(-len, len), random(-len, len));

                newTarget.x = constrain(
                    newTarget.x,
                    this.champion.radius,
                    this.champion.world.groundMap.width - this.champion.radius
                );

                newTarget.y = constrain(
                    newTarget.y,
                    this.champion.radius,
                    this.champion.world.groundMap.height - this.champion.radius
                );

                this.champion.targetMove = newTarget;
            }
        }
    }

    autoAttack() {
        if (random(1) < 0.1) {
            const closestEnemy = Helper.Distance.getClosestChampionInRange({
                rootPosition: this.champion.position,
                champions: this.world.champions,
                inRange: this.autoAttackRadius,
                addChampRadiusToRange: true,
                allyWithPlayer: !this.champion.isAllyWithPlayer,
                excludes: [this.champion],
            });

            if (closestEnemy) {
                const destination = closestEnemy.position.copy();
                const spellId = random([1, 2, 3, 4]);

                this.champion.castSpell("spell" + spellId, destination);
            }
        }
    }

    autoDefense() {
        // move to turret if health is low
        if (this.mode == "defense") {
            if (this.champion.isAllyWithPlayer)
                this.champion.targetMove.set(
                    this.champion.radius * 2,
                    this.champion.world.groundMap.height -
                        this.champion.radius * 2
                );
            else
                this.champion.targetMove.set(
                    this.champion.world.groundMap.width -
                        this.champion.radius * 2,
                    this.champion.radius * 2
                );
        }
    }

    autoChangeMode() {
        if (this.mode == "defense") {
            if (
                this.champion.health > this.champion.maxHealth * 0.9 ||
                this.champion.mana > this.champion.maxMana * 0.9
            ) {
                this.mode = "attack";
            }
        } else {
            if (
                this.champion.health < this.champion.maxHealth * 0.5 ||
                this.champion.mana < this.champion.maxMana * 0.2
            ) {
                this.mode = "defense";
            }
        }
    }
}
