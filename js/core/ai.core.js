class AICore {
    constructor(config = {}) {
        this.champion = null;
        this.world = null;
        this.autoAttackRadius = 300;

        Helper.Other.setValueFromConfig(this, config);
    }

    run() {
        //this.autoShow();
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
        if (this.champion.isArrivedTargetMove() || !this.champion.targetMove) {
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
        // TODO add your code here
    }
}
