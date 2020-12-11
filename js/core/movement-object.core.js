class MovementObject {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.targetMove = null;
        this.size = 75;
        this.speed = 3;
        this.fillColor = "white";
        this.strokeColor = "black";
        this.bound = null;

        // set value
        for (let c in config) {
            this[c] = config[c];
        }
    }

    show() {
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(1);
        circle(this.position.x, this.position.y, this.size);
    }

    move() {
        // move to targetMove
        const { targetMove, position, speed } = this;

        if (!this.isArrivedTargetMove()) {
            let direction = p5.Vector.sub(targetMove, position);
            this.position.add(direction.setMag(speed));
        }

        // bound position
        let bounded = this.applyBound(position.x, position.y);
        this.position.set(bounded.x, bounded.y);
    }

    isArrivedTargetMove() {
        const { targetMove, position, speed } = this;
        return !targetMove || p5.Vector.dist(position, targetMove) <= speed;
    }

    moveTo(x, y) {
        let bounded = this.applyBound(x, y);

        if (this.targetMove) {
            this.targetMove.set(bounded.x, bounded.y);
        } else {
            this.targetMove = bounded;
        }
    }

    applyBound(x, y) {
        if (this.bound) {
            const { top, bottom, left, right } = this.bound;
            const halfSize = this.size / 2;

            return createVector(
                constrain(x, left + halfSize, right - halfSize),
                constrain(y, top + halfSize, bottom - halfSize)
            );
        }

        return createVector(x, y);
    }

    overlap(other) {
        return (
            p5.Vector.dist(this.position, other.position) <
            this.size / 2 + other.size / 2
        );
    }
}
