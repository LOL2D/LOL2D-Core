class AhriBasicAttackObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.radius = 10;
        this.speed = 8;
        this.isShowPositionTracking = true;

        // custom attributes
        this.touchedTarget = false;
    }

    // override
    // show() {}

    // override
    effectChampions(champions) {
        let touchedTarget =
            p5.Vector.dist(this.targetChampion.position, this.position) <
            this.targetChampion.radius;

        if (touchedTarget) {
            this.touchedTarget = true;
            this.targetChampion.loseHealth(this.owner.basicAttackDamage, this);
        }
    }

    // override
    //move() {}

    // override
    checkFinished() {
        return this.touchedTarget == true;
    }

    // // other functions here
}
