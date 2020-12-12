class OrbOfDeceptionObject extends AbilityObjectCore {
    constructor(config = {}) {
        super(config);

        this.fillColor = "blue";
        this.isShowPositionTracking = true;

        this.state = "forward"; // 1: go forward, 2: go back to owner
        this.effectedStateForward = []; // list of  champions effected in state forward
        this.effectedStateBackward = []; // list of  champions effected in state backward
        this.limitSpeedBackward = 20;

        this.defaultSpeed = this.speed;
    }

    // override
    effect(champion) {
        if (
            this.state == "forward" &&
            this.effectedStateForward.indexOf(champion) < 0
        ) {
            this.effectedStateForward.push(champion);
            champion.loseHealth(this.damage);
        } else if (
            this.state == "backward" &&
            this.effectedStateBackward.indexOf(champion) < 0
        ) {
            this.effectedStateBackward.push(champion);
            champion.loseHealth(this.damage);
        }
    }

    // override
    move() {
        super.move();

        if (this.isArrivedTargetMove()) {
            this.state = "backward";
            this.targetMove = this.owner.position;
            this.speed = 0;
        }

        if (this.state == "backward") {
            if (this.speed <= this.limitSpeedBackward - 0.2) this.speed += 0.2;
        }
    }

    // override
    checkFinished() {
        return (
            this.state == "backward" &&
            p5.Vector.dist(this.position, this.owner.position) <
                this.owner.radius
        );
    }
}
