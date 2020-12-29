import Helper from "../../../../helper/index.js";
import AbilityObjectCore from "../../../../core/ability-object.core.js";

export default class CharmObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.fillColor = "#F738DE";
        this.isShowPositionTracking = true;
        this.positionTrackColor = "#F738DE55";
        this.speed = 10;

        // custom attributes
        this.touchedTarget = false;
    }

    // override
    // update() {}

    // override
    // show() {}

    // override
    effectChampions(champions) {
        let touchedEnemy = Helper.Distance.getClosestChampionInRange({
            rootPosition: this.position,
            champions: champions,
            inRange: this.radius,
            addChampRadiusToRange: true,
            allyWithPlayer: !this.owner.isAllyWithPlayer,
            excludes: [this.owner],
        });

        if (touchedEnemy) {
            touchedEnemy.loseHealth(this.damage, this);
            this.touchedTarget = true;
        }
    }

    // override
    // move() {}

    // override
    checkFinished() {
        return this.touchedTarget || this.isArrivedDestination();
    }

    // other functions here
}
