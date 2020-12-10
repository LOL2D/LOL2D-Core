class Player {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.targetMove = null;
        this.size = 20;
        this.speed = 1.5;
        this.fillColor = "white";
        this.strokeColor = "black";
        this.bound = null;

        // set value
        for (let c in config) {
            this[c] = config[c];
        }
    }

    run() {
        this.move();
        this.show();
    }

    show() {
        fill(this.fillColor);
        stroke(this.strokeColor);
        circle(this.position.x, this.position.y, this.size);
    }

    move() {
        // move to targetMove
        const { dist, sub } = p5.Vector;
        const { targetMove, position, speed } = this;

        if (targetMove && dist(position, targetMove) > speed) {
            let direction = sub(targetMove, position);
            this.position.add(direction.setMag(speed));
        }

        // bound position
        let bounded = this.applyBound(position.x, position.y);
        this.position.set(bounded.x, bounded.y);
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
}
