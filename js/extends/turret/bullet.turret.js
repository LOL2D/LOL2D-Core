import Helper from "../../helper/index.js";
import AbilityObjectCore from "../../core/ability-object.core.js";

export default class BulletTurretObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.isShowPositionTracking = true;
        this.positionTrackColor = "#f009";
        this.positionTrackWeight = 10;
        this.radius = 10;
        this.fillColor = "#f00";
        this.strokeColor = "#fff";
        this.strokeWeight = 2;
        this.speed = 7;

        // custom attributes
        this.targetChamp = config.targetChamp;
        this.touchedTarget = false;
        this.damage = 0;

        Helper.Other.setValueFromConfig(this, config);
    }

    // override
    //show() {}

    // override
    effectChampions(champions) {
        let isTouchedTarget = Helper.Collide.circleCircle(
            this.position.x,
            this.position.y,
            this.radius,
            this.targetChamp.position.x,
            this.targetChamp.position.y,
            this.targetChamp.radius
        );

        if (isTouchedTarget) {
            this.targetChamp.loseHealth(this.damage, this);
            this.touchedTarget = true;
        }
    }

    // override
    //move() {}

    // override
    checkFinished() {
        return this.touchedTarget;
    }

    // // other functions here
}
