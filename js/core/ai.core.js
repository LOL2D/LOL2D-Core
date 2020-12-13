class AICore {
    constructor(config = {}) {
        this.champion = null;
        this.world = {};

        Helper.Other.setValueFromConfig(this, config);
    }

    run() {
        this.autoMove();
        this.autoAttack();
        this.autoDefense();
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
                this.world.gamemap.width - this.champion.radius
            );

            newTarget.y = constrain(
                newTarget.y,
                this.champion.radius,
                this.world.gamemap.height - this.champion.radius
            );

            this.champion.targetMove = newTarget;
        }
    }

    autoAttack() {
        // TODO add your code here
    }
    autoDefense() {
        // TODO add your code here
    }
}
