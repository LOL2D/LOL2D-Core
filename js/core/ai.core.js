class AICore {
    constructor(config = {}) {
        this.champion = null;
        this.world = {};

        Utils.setValueFromConfig(this, config);
    }

    run() {
        this.autoMove();
        this.autoAttack();
        this.autoDefense();
    }

    autoMove() {
        // basic move test
        if (this.champion.isArrivedTargetMove() || !this.champion.targetMove) {
            let newTarget = this.champion.position
                .copy()
                .add(random(-500, 500), random(-500, 500));

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

    autoAttack() {}
    autoDefense() {}
}
