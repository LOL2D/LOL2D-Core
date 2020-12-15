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
        // get all enemies in range
        const enemies = Helper.Distance.getChampionsInRange({
            rootPosition: this.champion.position,
            champions: this.world.champions,
            inRange: this.autoAttackRadius,
            allyWithPlayer: !this.champion.isAllyWithPlayer,
            excludes: [this.champion],
        });

        // reset target champ
        this.targetChamp = null;

        if (enemies.length > 0) {
            // find champion that have lowest health
            let targetChamp = enemies[0];
            for (let e of enemies) {
                if (e.health <= targetChamp.health) {
                    targetChamp = e;
                }
            }

            // spell to it - add random check here to decrease power of AI :)
            if (random(1) < 0.5) {
                const destination = targetChamp.position.copy();
                const spellId = random([1, 2, 3, 4]);

                this.champion.castSpell("spell" + spellId, destination);
            }

            // get closer to targetChamp
            let followRange = 250; // this.champion.attackRange; // not available yet
            let shouldFollow =
                // check health
                this.champion.health >= targetChamp.health &&
                // check distance
                p5.Vector.dist(
                    this.champion.targetMove,
                    targetChamp.position
                ) > followRange;

            if (shouldFollow) {
                this.champion.targetMove = targetChamp.position
                    .copy()
                    .add(
                        random(-followRange, followRange),
                        random(-followRange, followRange)
                    );

                // save to use in autoChangeMode
                this.targetChamp = targetChamp;
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
                !this.targetChamp &&
                (this.champion.health < this.champion.maxHealth * 0.5 ||
                    this.champion.mana < this.champion.maxMana * 0.2)
            ) {
                this.mode = "defense";
            }
        }
    }
}
