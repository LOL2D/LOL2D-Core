import Helper from "../helper/index.js";

export default class AICore {
    constructor(config = {}) {
        this.champion = null;
        this.world = null;
        this.autoAttackRadius = 300;

        Helper.Other.setValueFromConfig(this, config);

        // setup
        this.champion.removeDestination();
        this.mode = "attack";
    }

    update() {
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
            if (this.champion.isArrivedDestination()) {
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

                this.champion.destination.set(newTarget.x, newTarget.y);
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
            if (random(1) < 0.1) {
                const dest = targetChamp.position.copy();
                const spellId = random([
                    "spell1",
                    "spell2",
                    "spell3",
                    "spell4",
                    "basicAttack",
                ]);

                this.champion.castSpell(spellId, dest);
            }

            // get closer to targetChamp
            let followRange = 250; // this.champion.attackRange; // not available yet
            let shouldFollow =
                // check health
                this.champion.health >= targetChamp.health &&
                // check distance
                p5.Vector.dist(
                    this.champion.destination,
                    targetChamp.position
                ) > followRange;

            if (shouldFollow) {
                let vec = targetChamp.position
                    .copy()
                    .add(
                        random(-followRange, followRange),
                        random(-followRange, followRange)
                    );

                this.champion.destination.set(vec.x, vec.y);
                // save to use in autoChangeMode
                this.targetChamp = targetChamp;
            }
        }
    }

    autoDefense() {
        // move to turret if health is low
        if (this.mode == "defense") {
            if (this.champion.isAllyWithPlayer)
                this.champion.destination.set(
                    this.champion.radius * 2,
                    this.champion.world.groundMap.height -
                        this.champion.radius * 2
                );
            else
                this.champion.destination.set(
                    this.champion.world.groundMap.width -
                        this.champion.radius * 2,
                    this.champion.radius * 2
                );
        }
    }

    autoChangeMode() {
        if (this.mode == "defense") {
            let fullResources =
                this.champion.health > this.champion.maxHealth * 0.9 ||
                this.champion.mana > this.champion.maxMana * 0.9;

            let moreHealthThanTarget =
                this.targetChamp &&
                this.targetChamp.health < this.champion.health;

            if (fullResources || moreHealthThanTarget) {
                this.mode = "attack";
            }
        } else {
            let outOfResources =
                this.champion.health < this.champion.maxHealth * 0.5 ||
                this.champion.mana < this.champion.maxMana * 0.2;

            let lessHealthThanTarget =
                this.targetChamp &&
                this.targetChamp.health < this.champion.health;

            if ((lessHealthThanTarget || !this.targetChamp) && outOfResources) {
                this.mode = "defense";
            }
        }
    }
}
