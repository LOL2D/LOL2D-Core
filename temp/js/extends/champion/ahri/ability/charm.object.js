import Helper from "../../../../helper/index.js";
import AbilityObjectCore from "../../../../core/ability-object.core.js";
import CharmCrowd from "../../../crowd-control/charm.crowd.js";

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
    onEffect() {
        let touchedEnemy = this.world.getClosestChampionInRange({
            rootPosition: this.position,
            inRange: this.radius,
            addChampRadiusToRange: true,
            allyWithPlayer: !this.owner.isAllyWithPlayer,
            excludes: [this.owner],
        });

        if (touchedEnemy) {
            touchedEnemy.loseHealth(this.damage, this);

            this.world.addNewEffectOnChampion(
                new CharmCrowd({
                    owner: this.owner,
                    target: touchedEnemy,
                    duration: 1500,
                })
            );

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
