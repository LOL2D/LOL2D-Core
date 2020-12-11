class OrbOfDeceptionObject extends AbilityObject {
    constructor(config = {}) {
        super(config);

        this.size = 50;
        this.fillColor = "blue";

        this.state = "forward"; // 1: go forward, 2: go back to owner
        this.effectedState1 = []; // list of  champions effected in state 1
        this.effectedState2 = []; // list of  champions effected in state 2

        this.defaultSpeed = this.speed;
    }

    effect(champion) {
        if (
            this.state == "forward" &&
            this.effectedState1.indexOf(champion) < 0
        ) {
            this.effectedState1.push(champion);
            champion.loseHealth(this.damage);
        } else if (
            this.state == "backward" &&
            this.effectedState2.indexOf(champion) < 0
        ) {
            this.effectedState2.push(champion);
            champion.loseHealth(this.damage);
        }
    }

    move() {
        super.move();

        if (this.isArrivedTargetMove()) {
            this.state = "backward";
            this.targetMove = this.owner.position;
            this.speed = 0;
        }

        if (this.state == "backward") {
            this.speed += 0.2;
        }
    }

    checkFinished() {
        return (
            this.state == "backward" &&
            p5.Vector.dist(this.position, this.owner.position) <
                this.owner.size / 2
        );
    }
}
