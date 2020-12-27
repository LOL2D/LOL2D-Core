import Helper from "../../../../helper/index.js";
import AbilityObjectCore from "../../../../core/ability-object.core.js";

export default class OrbOfDeceptionObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.fillColor = "#77f";
        this.isShowPositionTracking = true;
        this.positionTrackColor = "#77F5";
        this.speed = 9;

        // custom attribute
        this.STATE = {
            FORWARD: 1,
            BACKWARD: 2,
        };
        this.state = this.STATE.FORWARD;
        this.effectedChampions = []; // list of  champions effected
        this.maxSpeedBackward = 10;
        this.increaseSpeedBackward = 0.15;
    }

    // override
    effectChampions(champions) {
        let closestEnemy = Helper.Distance.getClosestChampionInRange({
            rootPosition: this.position,
            champions: champions,
            inRange: this.radius,
            addChampRadiusToRange: true,
            allyWithPlayer: !this.owner.isAllyWithPlayer,
            excludes: [this.owner],
        });

        if (closestEnemy && this.effectedChampions.indexOf(closestEnemy) < 0) {
            closestEnemy.loseHealth(this.damage, this);
            this.effectedChampions.push(closestEnemy);
        }
    }

    // override
    move() {
        super.move();

        // backward
        if (this.state == this.STATE.BACKWARD) {
            this.speed += this.increaseSpeedBackward;
            this.speed = constrain(this.speed, 0, this.maxSpeedBackward);
        }
        // forward
        else if (this.isArrivedDestination()) {
            this.state = this.STATE.BACKWARD;
            this.effectedChampions = [];
            this.destination = this.owner.position;
            this.speed = 0;
        }
    }

    // override
    checkFinished() {
        return (
            this.state == this.STATE.BACKWARD &&
            p5.Vector.dist(this.position, this.owner.position) < this.radius
        );
    }
}
